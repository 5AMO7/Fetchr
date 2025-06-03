<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedLead extends Model
{
    protected $fillable = [
        'user_id',
        'lead_id',
        'notes',
    ];
    
     public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
