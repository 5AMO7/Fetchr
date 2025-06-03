<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CampaignStepLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_step_id',
        'campaign_lead_id',
        'status',
        'scheduled_at',
        'sent_at',
        'opened_at',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'opened_at' => 'datetime',
    ];

    /**
     * Get the campaign step that owns the log.
     */
    public function campaignStep(): BelongsTo
    {
        return $this->belongsTo(CampaignStep::class);
    }

    /**
     * Get the campaign lead that owns the log.
     */
    public function campaignLead(): BelongsTo
    {
        return $this->belongsTo(CampaignLead::class);
    }

    /**
     * Get the email opens for the step log.
     */
    public function emailOpens(): HasMany
    {
        return $this->hasMany(EmailOpen::class);
    }

    /**
     * Scope a query to only include pending logs.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include sent logs.
     */
    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    /**
     * Scope a query to only include opened logs.
     */
    public function scopeOpened($query)
    {
        return $query->where('status', 'opened');
    }

    /**
     * Scope a query to only include failed logs.
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * Scope a query to only include logs scheduled before a given time.
     */
    public function scopeScheduledBefore($query, $datetime)
    {
        return $query->where('scheduled_at', '<=', $datetime);
    }

    /**
     * Mark the log as sent.
     */
    public function markAsSent(): void
    {
        $this->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }

    /**
     * Mark the log as opened.
     */
    public function markAsOpened(): void
    {
        $this->update([
            'status' => 'opened',
            'opened_at' => now(),
        ]);
    }

    /**
     * Mark the log as failed.
     */
    public function markAsFailed(): void
    {
        $this->update([
            'status' => 'failed',
        ]);
    }

    /**
     * Check if the email has been opened.
     */
    public function isOpened(): bool
    {
        return $this->status === 'opened' || $this->emailOpens()->exists();
    }
}
