<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailOpen extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_step_log_id',
        'lead_id',
        'ip_address',
        'user_agent',
        'opened_at',
    ];

    protected $casts = [
        'opened_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    // Disable updated_at since we only have created_at
    public $timestamps = false;

    protected $dates = ['opened_at', 'created_at'];

    /**
     * Get the campaign step log that owns the email open.
     */
    public function campaignStepLog(): BelongsTo
    {
        return $this->belongsTo(CampaignStepLog::class);
    }

    /**
     * Get the lead that owns the email open.
     */
    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    /**
     * Scope a query to only include opens from today.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('opened_at', today());
    }

    /**
     * Scope a query to only include opens from a specific date range.
     */
    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('opened_at', [$startDate, $endDate]);
    }

    /**
     * Scope a query to only include opens by IP address.
     */
    public function scopeByIp($query, $ipAddress)
    {
        return $query->where('ip_address', $ipAddress);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($emailOpen) {
            $emailOpen->created_at = now();
        });
    }
}
