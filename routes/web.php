<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PitchDeckController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        $pitchDecks = $user->pitchDecks()->orderBy('created_at', 'desc')->get();

        $stats = [
            'total' => $pitchDecks->count(),
            'completed' => $pitchDecks->where('status', 'completed')->count(),
            'processing' => $pitchDecks->whereIn('status', ['pending', 'processing'])->count(),
            'failed' => $pitchDecks->where('status', 'failed')->count(),
        ];

        return Inertia::render('Dashboard', [
            'pitchDecks' => $pitchDecks,
            'stats' => $stats,
        ]);
    })->name('dashboard');

    Route::get('/analyzer', [PitchDeckController::class, 'index'])->name('analyzer.index');
    Route::post('/analyzer/upload', [PitchDeckController::class, 'upload'])->name('analyzer.upload');
    Route::post('/analyzer/{pitchDeck}/cancel', [PitchDeckController::class, 'cancel'])->name('analyzer.cancel');
    Route::delete('/analyzer/{pitchDeck}', [PitchDeckController::class, 'destroy'])->name('analyzer.destroy');
    Route::get('/analyzer/pdf/{pitchDeck}', [PitchDeckController::class, 'streamPdf'])->name('analyzer.pdf');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
