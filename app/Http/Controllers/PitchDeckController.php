<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Jobs\ConvertDocumentToPdf;
use App\Jobs\AnalyzePitchDeckJob;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PitchDeckController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Analyzer', [
            'status' => session('status'),
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,docx|max:20480', // Maksimal 20MB
        ]);

        $file = $request->file('document');
        $path = $file->store('pitchdecks', 'local');
        $absolutePath = storage_path('app/private/' . $path); // Laravel 11 private storage path

        // Jika user mengunggah DOCX, konversi dulu ke PDF secara asinkron
        $extension = strtolower($file->getClientOriginalExtension());

        if ($extension === 'docx') {
            ConvertDocumentToPdf::withChain([
                new AnalyzePitchDeckJob($absolutePath)
            ])->dispatch($absolutePath);
        } else {
            AnalyzePitchDeckJob::dispatch($absolutePath);
        }

        return back()->with('status', 'Berkas berhasil diunggah dan sedang diproses dalam antrean.');
    }
}
