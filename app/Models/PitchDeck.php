<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PitchDeck extends Model
{
    protected $fillable = [
        'user_id',
        'filename',
        'original_name',
        'status',
        'results',
    ];

    protected $casts = [
        'results' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
