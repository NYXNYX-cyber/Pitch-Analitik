<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ConvertDocumentToPdf implements ShouldQueue
{
    use Queueable;

    protected string $filePath;

    /**
     * Create a new job instance.
     */
    public function __construct(string $filePath)
    {
        $this->filePath = $filePath;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if (!file_exists($this->filePath)) {
            throw new \InvalidArgumentException("File tidak ditemukan: {$this->filePath}");
        }

        $extension = strtolower(pathinfo($this->filePath, PATHINFO_EXTENSION));
        if ($extension === 'pdf') {
            return; // Sudah PDF, tidak perlu dikonversi
        }

        $outdir = dirname($this->filePath);

        // Menjalankan LibreOffice headless CLI via shell_exec
        $command = sprintf(
            'soffice --headless --convert-to pdf --outdir %s %s 2>&1',
            escapeshellarg($outdir),
            escapeshellarg($this->filePath)
        );

        $output = [];
        $returnVar = 0;
        exec($command, $output, $returnVar);

        if ($returnVar !== 0) {
            throw new \RuntimeException("Gagal mengonversi dokumen ke PDF: " . implode("\n", $output));
        }
    }
}
