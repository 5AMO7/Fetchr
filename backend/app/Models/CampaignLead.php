<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CampaignLead extends Model
{
    use HasFactory;

    protected $table = 'campaign_leads';

    protected $fillable = [
        'campaign_id',
        'lead_id',
    ];

    /**
     * Get the campaign that owns the campaign lead.
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    /**
     * Get the lead that owns the campaign lead.
     */
    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    /**
     * Get the campaign step logs for the campaign lead.
     */
    public function stepLogs(): HasMany
    {
        return $this->hasMany(CampaignStepLog::class);
    }

    /**
     * Get the latest step log for the campaign lead.
     */
    public function latestStepLog()
    {
        return $this->hasOne(CampaignStepLog::class)->latest();
    }

    /**
     * Get the email opens for the campaign lead.
     */
    public function emailOpens(): HasMany
    {
        return $this->hasMany(EmailOpen::class, 'lead_id', 'lead_id');
    }
}
