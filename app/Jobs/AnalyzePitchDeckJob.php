<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class AnalyzePitchDeckJob implements ShouldQueue
{
    use Queueable;

    public $timeout = 600; // 10 menit

    protected int $pitchDeckId;
    protected ?string $firecrawlApiKey;
    protected string $firecrawlUrl;
    protected string $qdrantUrl;
    protected ?string $qdrantKey;
    protected string $vllmUrl;
    protected ?string $vllmKey;
    protected string $vllmModel;

    /**
     * Create a new job instance.
     */
    public function __construct(int $pitchDeckId)
    {
        $this->pitchDeckId = $pitchDeckId;
        $this->firecrawlApiKey = config('services.firecrawl.key') ?? '';
        $this->firecrawlUrl = config('services.firecrawl.url') ?? 'http://localhost:3002';
        $this->qdrantUrl = config('services.qdrant.url') ?? 'http://localhost:6333';
        $this->qdrantKey = config('services.qdrant.key') ?? '';
        $this->vllmUrl = config('services.vllm.url') ?? 'http://43.156.111.140:20128/v1';
        $this->vllmKey = config('services.vllm.key') ?? '';
        $this->vllmModel = config('services.vllm.model') ?? 'ag/gemini-3-flash-agent';
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $pitchDeck = \App\Models\PitchDeck::findOrFail($this->pitchDeckId);
        $pdfPath = storage_path('app/private/' . $pitchDeck->filename);

        if (!file_exists($pdfPath)) {
            $pitchDeck->update(['status' => 'failed', 'progress' => 0]);
            throw new \InvalidArgumentException("Berkas PDF tidak ditemukan: {$pdfPath}");
        }

        // Mulai pemrosesan setelah konversi PDF
        // Asumsikan konversi PDF memberi 10%
        $pitchDeck->update(['status' => 'processing', 'progress' => 15]);

        try {
            // 1. Ekstrak halaman PDF menjadi gambar menggunakan pdftoppm (CLI utility Linux)
            $outputDir = storage_path('app/pitchdeck_pages/' . uniqid());
            if (!is_dir($outputDir)) {
                mkdir($outputDir, 0755, true);
            }

            $command = sprintf(
                'pdftoppm -png -r 150 %s %s/page',
                escapeshellarg($pdfPath),
                escapeshellarg($outputDir)
            );
            exec($command, $output, $returnVar);

            if ($returnVar !== 0) {
                $pitchDeck->update(['progress' => 0]);
                throw new \RuntimeException("Gagal mengonversi halaman PDF ke gambar.");
            }

            $images = glob($outputDir . '/page-*.png');
            sort($images);
            $totalImages = count($images);

            $pitchDeck->update(['progress' => 20]);

            $results = [];

            foreach ($images as $index => $imagePath) {
                // Cek apakah audit dibatalkan oleh pengguna di tengah jalan
                $pitchDeck->refresh();
                if ($pitchDeck->status === 'failed' && isset($pitchDeck->results['cancelled'])) {
                    // Bersihkan berkas temporer sebelum keluar
                    foreach ($images as $img) {
                        @unlink($img);
                    }
                    @rmdir($outputDir);
                    return;
                }

                $pageNum = $index + 1;

                // 2. Kirim gambar ke vLLM API (Qwen2.5-VL) untuk dianalisis
                $analysisResult = $this->analyzeImageWithVllm($imagePath);

                // Update progres setelah analisis vLLM per halaman
                // Porsi analisis per halaman berkisar dari 20% ke 95%
                $stepProgress = 20 + intval((($pageNum - 0.5) / $totalImages) * 75);
                $pitchDeck->update(['progress' => min($stepProgress, 90)]);

                // Fact check & verification searches
                $factCheckResults = [];
                $insufficientData = $analysisResult['insufficient_data'] ?? false;
                $suggestedQueries = $analysisResult['suggested_queries'] ?? [];
                if ($insufficientData && is_array($suggestedQueries) && !empty($suggestedQueries)) {
                    $firstQuery = $suggestedQueries[0];
                    if (is_string($firstQuery) && !empty($firstQuery)) {
                        $factCheckResults['missing_data_search'] = $this->performFirecrawlSearch($firstQuery);
                    }
                }

                $verifications = $analysisResult['verifications'] ?? [];
                if (is_array($verifications)) {
                    foreach ($verifications as $key => $verification) {
                        if (is_array($verification)) {
                            $status = $verification['status'] ?? '';
                            $searchQuery = $verification['search_query'] ?? '';
                            if ($status === 'needs_verification' && is_string($searchQuery) && !empty($searchQuery)) {
                                $verifications[$key]['search_result'] = $this->performFirecrawlSearch($searchQuery);
                            }
                        }
                    }
                    $analysisResult['verifications'] = $verifications;
                }

                // 3. Jika ada kompetitor yang terdeteksi, perkaya informasi menggunakan Firecrawl API
                $competitors = $analysisResult['competitors'] ?? [];
                $enrichedCompetitors = [];
                foreach ($competitors as $competitor) {
                    $enrichedCompetitors[] = $this->enrichCompetitorData($competitor);
                }

                // 4. Integrasikan dengan Qdrant DB (RAG matching untuk benchmarking)
                $vectorResult = $this->matchCompetitorEmbeddingWithQdrant($analysisResult);

                $results[$pageNum] = [
                    'analysis' => $analysisResult,
                    'competitors_enriched' => $enrichedCompetitors,
                    'benchmarks' => $vectorResult,
                    'fact_check_results' => $factCheckResults,
                ];

                // Update progres selesai per halaman
                $pageDoneProgress = 20 + intval(($pageNum / $totalImages) * 75);
                $pitchDeck->update(['progress' => min($pageDoneProgress, 95)]);
            }

            // Hapus file gambar temporer
            foreach ($images as $img) {
                @unlink($img);
            }
            @rmdir($outputDir);

            // Simpan hasil ke database
            $pitchDeck->update([
                'status' => 'completed',
                'progress' => 100,
                'results' => $results,
            ]);
        } catch (\Exception $e) {
            $pitchDeck->update(['status' => 'failed', 'progress' => 0]);
            throw $e;
        }
    }

    protected function analyzeImageWithVllm(string $imagePath): array
    {
        $base64Image = base64_encode(file_get_contents($imagePath));

        $headers = [];
        if (!empty($this->vllmKey)) {
            $headers['Authorization'] = 'Bearer ' . $this->vllmKey;
        }

        $response = \Illuminate\Support\Facades\Http::withHeaders($headers)
            ->timeout(60)
            ->post("{$this->vllmUrl}/chat/completions", [
                'model' => $this->vllmModel,
                'stream' => false,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => [
                            [
                                'type' => 'text',
                                'text' => 'Analisis slide pitch deck ini. Identifikasi komponen bisnis, metrik keuangan, kompetitor, dan lakukan analisis data/klaim. Kembalikan respons murni berformat JSON dengan skema: {"summary": "Analisis mendalam mengenai isi slide...", "metrics": {"burn_rate": "value_or_null", "revenue": "value_or_null"}, "competitors": ["NamaKompetitor"], "insufficient_data": false, "verifications": [{"claim": "Klaim/data spesifik dari slide yang perlu diverifikasi atau dinilai kebenarannya", "status": "verified_fact | needs_verification | unverified", "explanation": "Alasan penilaian status fakta ini", "search_query": "Kata kunci pencarian spesifik untuk memverifikasi klaim ini di internet"}], "suggested_queries": ["Kueri pencarian untuk menemukan data yang hilang jika insufficient_data bernilai true"]}',
                            ],
                            [
                                'type' => 'image_url',
                                'image_url' => [
                                    'url' => "data:image/png;base64,{$base64Image}",
                                ],
                            ],
                        ],
                    ],
                ],
                'response_format' => ['type' => 'json_object'],
            ]);

        if ($response->failed()) {
            return [
                'summary' => 'Gagal menganalisis slide ini.',
                'metrics' => ['burn_rate' => null, 'revenue' => null],
                'competitors' => [],
                'insufficient_data' => true,
                'verifications' => [],
                'suggested_queries' => ['Gagal menganalisis slide ini']
            ];
        }

        $body = $response->json();
        $content = $body['choices'][0]['message']['content'] ?? '{}';

        return json_decode($content, true) ?: [];
    }

    protected function performFirecrawlSearch(string $query): array
    {
        $headers = [];
        if (!empty($this->firecrawlApiKey)) {
            $headers['Authorization'] = 'Bearer ' . $this->firecrawlApiKey;
        }

        try {
            $response = \Illuminate\Support\Facades\Http::withHeaders($headers)
                ->post("{$this->firecrawlUrl}/v1/search", [
                    'query' => $query,
                    'limit' => 2,
                ]);

            if ($response->failed()) {
                return ['error' => 'Firecrawl search failed', 'status' => $response->status()];
            }

            return $response->json() ?? [];
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    protected function enrichCompetitorData(string $competitorName): array
    {
        // Gunakan Firecrawl API untuk melakukan search/scrape data terbaru kompetitor
        $response = \Illuminate\Support\Facades\Http::post("{$this->firecrawlUrl}/v1/scrape", [
            'url' => "https://www.google.com/search?q=" . urlencode($competitorName),
            'formats' => ['markdown'],
        ]);

        if ($response->failed()) {
            return ['name' => $competitorName, 'details' => 'Gagal mengambil data kompetitor.'];
        }

        return [
            'name' => $competitorName,
            'details' => $response->json('data.markdown') ?? 'Data tidak tersedia.',
        ];
    }

    protected function matchCompetitorEmbeddingWithQdrant(array $analysis): array
    {
        $headers = [];
        if (!empty($this->qdrantKey)) {
            $headers['api-key'] = $this->qdrantKey;
        }

        // Panggil endpoint search vector Qdrant DB
        $response = \Illuminate\Support\Facades\Http::withHeaders($headers)
            ->post("{$this->qdrantUrl}/collections/pitchdecks/points/search", [
                'vector' => array_fill(0, 768, 0.0), // Placeholder vector, sesuaikan dengan embedding yang digunakan di backend Anda
                'limit' => 3,
                'with_payload' => true,
            ]);

        if ($response->failed()) {
            return [];
        }

        return $response->json('result') ?? [];
    }
}
