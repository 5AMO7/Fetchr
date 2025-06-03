<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Get the user that owns the campaign.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the campaign steps for the campaign.
     */
    public function steps(): HasMany
    {
        return $this->hasMany(CampaignStep::class)->orderBy('step_order');
    }

    /**
     * Get the campaign leads for the campaign.
     */
    public function campaignLeads(): HasMany
    {
        return $this->hasMany(CampaignLead::class);
    }

    /**
     * Get the leads associated with the campaign.
     */
    public function leads(): BelongsToMany
    {
        return $this->belongsToMany(Lead::class, 'campaign_leads');
    }

    /**
     * Scope a query to only include campaigns of a given status.
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include active campaigns.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include draft campaigns.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope a query to only include completed campaigns.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
}
