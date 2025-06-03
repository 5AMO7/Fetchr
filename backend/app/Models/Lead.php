<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_name',
        'reg_type',
        'registration_number',
        'email',
        'phone_number',
        'website',
        'facebook',
        'linkedin',
        'instagram',
        'twitter',
        'address',
        'city',
        'country',
        'industry',
        'description',
        'profitable',
        'employee_count',
        'founded_date',
        'source',
        'confidence_score',
        'last_verified_at',
    ];

    /**
     * Get the campaigns associated with the lead.
     */
    public function campaigns(): BelongsToMany
    {
        return $this->belongsToMany(Campaign::class, 'campaign_leads');
    }

    /**
     * Get the campaign leads for the lead.
     */
    public function campaignLeads(): HasMany
    {
        return $this->hasMany(CampaignLead::class);
    }

    /**
     * Get the email opens for the lead.
     */
    public function emailOpens(): HasMany
    {
        return $this->hasMany(EmailOpen::class);
    }
}
