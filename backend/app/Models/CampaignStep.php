<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CampaignStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'step_order',
        'type',
        'delay_hours',
        'subject',
        'body',
    ];

    protected $casts = [
        'step_order' => 'integer',
        'delay_hours' => 'integer',
    ];

    /**
     * Get the campaign that owns the campaign step.
     */
    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    /**
     * Get the campaign step logs for the campaign step.
     */
    public function stepLogs(): HasMany
    {
        return $this->hasMany(CampaignStepLog::class);
    }

    /**
     * Scope a query to only include email steps.
     */
    public function scopeEmail($query)
    {
        return $query->where('type', 'email');
    }

    /**
     * Scope a query to order by step order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('step_order');
    }

    /**
     * Replace placeholders in the subject with lead data.
     */
    public function getProcessedSubject(Lead $lead): string
    {
        return $this->replacePlaceholders($this->subject, $lead);
    }

    /**
     * Replace placeholders in the body with lead data.
     */
    public function getProcessedBody(Lead $lead): string
    {
        return $this->replacePlaceholders($this->body, $lead);
    }

    /**
     * Replace placeholders in text with lead data.
     */
    private function replacePlaceholders(string $text, Lead $lead): string
    {
        $placeholders = [
            '{{lead.name}}' => $lead->business_name ?? '',
            '{{lead.business_name}}' => $lead->business_name ?? '',
            '{{lead.email}}' => $lead->email ?? '',
            '{{lead.phone_number}}' => $lead->phone_number ?? '',
            '{{lead.website}}' => $lead->website ?? '',
            '{{lead.city}}' => $lead->city ?? '',
            '{{lead.country}}' => $lead->country ?? '',
            '{{lead.industry}}' => $lead->industry ?? '',
        ];

        return str_replace(array_keys($placeholders), array_values($placeholders), $text);
    }
}
