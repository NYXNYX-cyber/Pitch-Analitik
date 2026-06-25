<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ConvertDocumentToPdf implements ShouldQueue
{
    use Queueable;

    protected int $pitchDeckId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $pitchDeckId)
    {
        $this->pitchDeckId = $pitchDeckId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $pitchDeck = \App\Models\PitchDeck::findOrFail($this->pitchDeckId);
        $filePath = storage_path('app/private/' . $pitchDeck->filename);

        if (!file_exists($filePath)) {
            $pitchDeck->update(['status' => 'failed']);
            throw new \InvalidArgumentException("File tidak ditemukan: {$filePath}");
        }

        $pitchDeck->update(['status' => 'processing', 'progress' => 5]);

        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        if ($extension === 'pdf') {
            $pitchDeck->update(['progress' => 10]);
            return;
        }

        $outdir = dirname($filePath);

        // Menjalankan LibreOffice headless CLI via shell_exec
        $command = sprintf(
            'soffice --headless --convert-to pdf --outdir %s %s 2>&1',
            escapeshellarg($outdir),
            escapeshellarg($filePath)
        );

        $output = [];
        $returnVar = 0;
        exec($command, $output, $returnVar);

        if ($returnVar !== 0) {
            $pitchDeck->update(['status' => 'failed', 'progress' => 0]);
            throw new \RuntimeException("Gagal mengonversi dokumen ke PDF: " . implode("\n", $output));
        }

        // Dapatkan nama file PDF yang dihasilkan
        $newPdfName = pathinfo($filePath, PATHINFO_FILENAME) . '.pdf';
        $newRelativePath = dirname($pitchDeck->filename) . '/' . $newPdfName;

        // Perbarui record PitchDeck dengan path PDF baru
        $pitchDeck->update([
            'filename' => $newRelativePath,
            'progress' => 10,
        ]);
    }
}
