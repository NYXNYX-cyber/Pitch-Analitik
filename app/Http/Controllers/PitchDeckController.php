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
    public function index(Request $request): Response
    {
        $user = $request->user();
        $pitchDecks = $user->pitchDecks()->orderBy('created_at', 'desc')->get();

        $activeDeck = null;
        $activeDeckId = $request->query('id');

        if ($activeDeckId) {
            $activeDeck = $pitchDecks->firstWhere('id', $activeDeckId);
        } elseif ($pitchDecks->isNotEmpty()) {
            $activeDeck = $pitchDecks->first();
        }

        $pdfUrl = null;
        if ($activeDeck && $activeDeck->status === 'completed') {
            $pdfUrl = route('analyzer.pdf', ['pitchDeck' => $activeDeck->id]);
        }

        return Inertia::render('Analyzer', [
            'status' => session('status'),
            'pitchDecks' => $pitchDecks,
            'activeDeck' => $activeDeck,
            'pdfUrl' => $pdfUrl,
        ]);
    }

    public function streamPdf(\App\Models\PitchDeck $pitchDeck)
    {
        // Pastikan hanya pemilik yang bisa melihat dokumen
        if ($pitchDeck->user_id !== auth()->id()) {
            abort(403);
        }

        $filePath = storage_path('app/private/' . $pitchDeck->filename);

        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->file($filePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . basename($filePath) . '"'
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,docx|max:10240', // Maksimal 10MB
        ], [
            'document.max' => 'Ukuran berkas tidak boleh melebihi 10MB. Silakan tingkatkan ke Premium untuk batas lebih besar!',
        ]);

        $file = $request->file('document');
        $path = $file->store('pitchdecks', 'local');
        $absolutePath = storage_path('app/private/' . $path); // Laravel 11 private storage path

        // Simpan ke database
        $pitchDeck = \App\Models\PitchDeck::create([
            'user_id' => $request->user()->id,
            'filename' => $path,
            'original_name' => $file->getClientOriginalName(),
            'status' => 'pending',
        ]);

        $extension = strtolower($file->getClientOriginalExtension());

        if ($extension === 'docx') {
            ConvertDocumentToPdf::withChain([
                new AnalyzePitchDeckJob($pitchDeck->id)
            ])->dispatch($pitchDeck->id);
        } else {
            AnalyzePitchDeckJob::dispatch($pitchDeck->id);
        }

        return back()->with('status', 'Berkas berhasil diunggah dan sedang diproses dalam antrean.');
    }
}
