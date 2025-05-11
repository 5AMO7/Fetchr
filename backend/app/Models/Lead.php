<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_name',
        'registration_number',
        'email',
        'phone_number',
        'website',
        'address',
        'city',
        'country',
        'industry',
        'description',
        'profitable',
        'size_category',
        'founded_date',
        'source',
        'confidence_score',
        'last_verified_at',
    ];
}
