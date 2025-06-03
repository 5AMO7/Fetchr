<?php

namespace App\Http\Controllers;

use App\Models\CampaignStepLog;
use App\Models\EmailOpen;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class EmailTrackingController extends Controller
{
    /**
     * Handle email open tracking via tracking pixel.
     * This endpoint serves a 1x1 transparent pixel and logs the open.
     */
    public function trackOpen(Request $request, string $token): Response
    {
        try {
            // Decode the tracking token to get campaign_step_log_id
            $campaignStepLogId = $this->decodeTrackingToken($token);
            
            if (!$campaignStepLogId) {
                return $this->serveTrackingPixel();
            }

            $campaignStepLog = CampaignStepLog::find($campaignStepLogId);
            
            if (!$campaignStepLog) {
                return $this->serveTrackingPixel();
            }

            // Get request information
            $ipAddress = $request->ip();
            $userAgent = $request->userAgent() ?? '';

            // Create email open record
            EmailOpen::create([
                'campaign_step_log_id' => $campaignStepLog->id,
                'lead_id' => $campaignStepLog->campaignLead->lead_id,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'opened_at' => now(),
            ]);

            // Update campaign step log status if not already opened
            if ($campaignStepLog->status !== 'opened') {
                $campaignStepLog->markAsOpened();
            }

            Log::info('Email open tracked', [
                'campaign_step_log_id' => $campaignStepLog->id,
                'lead_id' => $campaignStepLog->campaignLead->lead_id,
                'ip_address' => $ipAddress,
            ]);

        } catch (\Exception $e) {
            Log::error('Email tracking error', [
                'token' => $token,
                'error' => $e->getMessage(),
            ]);
        }

        return $this->serveTrackingPixel();
    }

    /**
     * Generate a tracking URL for a campaign step log.
     */
    public function generateTrackingUrl(CampaignStepLog $campaignStepLog): JsonResponse
    {
        $token = $this->generateTrackingToken($campaignStepLog->id);
        $trackingUrl = url("/api/email/track/{$token}");

        return response()->json([
            'tracking_url' => $trackingUrl,
            'tracking_pixel_html' => '<img src="' . $trackingUrl . '" width="1" height="1" style="display:none;" alt="" />',
        ]);
    }

    /**
     * Get email open analytics for a campaign step log.
     */
    public function getOpens(CampaignStepLog $campaignStepLog): JsonResponse
    {
        $opens = $campaignStepLog->emailOpens()
            ->orderBy('opened_at', 'desc')
            ->get()
            ->map(function ($open) {
                return [
                    'id' => $open->id,
                    'opened_at' => $open->opened_at,
                    'ip_address' => $open->ip_address,
                    'user_agent' => $open->user_agent,
                    'location' => $this->getLocationFromIp($open->ip_address),
                    'device_info' => $this->parseUserAgent($open->user_agent),
                ];
            });

        $analytics = [
            'total_opens' => $opens->count(),
            'unique_ips' => $opens->pluck('ip_address')->unique()->count(),
            'first_open' => $opens->last()?->opened_at ?? null,
            'latest_open' => $opens->first()?->opened_at ?? null,
            'opens' => $opens,
        ];

        return response()->json($analytics);
    }

    /**
     * Get aggregated email open statistics for a campaign.
     */
    public function getCampaignOpenStats(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'campaign_id' => 'required|exists:campaigns,id',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $query = EmailOpen::whereHas('campaignStepLog.campaignLead', function ($q) use ($validated) {
            $q->whereHas('campaign', function ($q2) use ($validated) {
                $q2->where('id', $validated['campaign_id']);
            });
        });

        if (isset($validated['date_from'])) {
            $query->where('opened_at', '>=', $validated['date_from']);
        }

        if (isset($validated['date_to'])) {
            $query->where('opened_at', '<=', $validated['date_to']);
        }

        $opens = $query->get();

        $stats = [
            'total_opens' => $opens->count(),
            'unique_leads' => $opens->pluck('lead_id')->unique()->count(),
            'unique_ips' => $opens->pluck('ip_address')->unique()->count(),
            'opens_by_day' => $opens->groupBy(function ($open) {
                return $open->opened_at->format('Y-m-d');
            })->map->count(),
            'opens_by_hour' => $opens->groupBy(function ($open) {
                return $open->opened_at->format('H');
            })->map->count(),
            'top_locations' => $opens->groupBy('ip_address')
                ->map(function ($group) {
                    $ip = $group->first()->ip_address;
                    return [
                        'ip' => $ip,
                        'count' => $group->count(),
                        'location' => $this->getLocationFromIp($ip),
                    ];
                })
                ->sortByDesc('count')
                ->take(10)
                ->values(),
        ];

        return response()->json($stats);
    }

    /**
     * Serve a 1x1 transparent tracking pixel.
     */
    private function serveTrackingPixel(): Response
    {
        // 1x1 transparent PNG pixel
        $pixel = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');

        return response($pixel, 200, [
            'Content-Type' => 'image/png',
            'Content-Length' => strlen($pixel),
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    /**
     * Generate a tracking token for a campaign step log ID.
     */
    private function generateTrackingToken(int $campaignStepLogId): string
    {
        // Simple base64 encoding with some obfuscation
        // In production, you might want to use encryption
        $data = json_encode([
            'id' => $campaignStepLogId,
            'timestamp' => time(),
        ]);

        return base64_encode($data);
    }

    /**
     * Decode a tracking token to get the campaign step log ID.
     */
    private function decodeTrackingToken(string $token): ?int
    {
        try {
            $data = json_decode(base64_decode($token), true);
            
            if (!$data || !isset($data['id'])) {
                return null;
            }

            return (int) $data['id'];
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get location information from IP address.
     * This is a placeholder - you would integrate with a real IP geolocation service.
     */
    private function getLocationFromIp(string $ipAddress): array
    {
        // Placeholder implementation
        // In production, integrate with services like MaxMind, IPinfo, etc.
        return [
            'country' => 'Unknown',
            'city' => 'Unknown',
            'region' => 'Unknown',
        ];
    }

    /**
     * Parse user agent string to extract device/browser information.
     */
    private function parseUserAgent(string $userAgent): array
    {
        // Basic user agent parsing
        $info = [
            'browser' => 'Unknown',
            'platform' => 'Unknown',
            'device' => 'Unknown',
        ];

        // Simple browser detection
        if (strpos($userAgent, 'Chrome') !== false) {
            $info['browser'] = 'Chrome';
        } elseif (strpos($userAgent, 'Firefox') !== false) {
            $info['browser'] = 'Firefox';
        } elseif (strpos($userAgent, 'Safari') !== false) {
            $info['browser'] = 'Safari';
        } elseif (strpos($userAgent, 'Edge') !== false) {
            $info['browser'] = 'Edge';
        }

        // Simple platform detection
        if (strpos($userAgent, 'Windows') !== false) {
            $info['platform'] = 'Windows';
        } elseif (strpos($userAgent, 'Mac') !== false) {
            $info['platform'] = 'macOS';
        } elseif (strpos($userAgent, 'Linux') !== false) {
            $info['platform'] = 'Linux';
        } elseif (strpos($userAgent, 'Android') !== false) {
            $info['platform'] = 'Android';
        } elseif (strpos($userAgent, 'iOS') !== false) {
            $info['platform'] = 'iOS';
        }

        // Simple device detection
        if (strpos($userAgent, 'Mobile') !== false || strpos($userAgent, 'Android') !== false) {
            $info['device'] = 'Mobile';
        } elseif (strpos($userAgent, 'Tablet') !== false || strpos($userAgent, 'iPad') !== false) {
            $info['device'] = 'Tablet';
        } else {
            $info['device'] = 'Desktop';
        }

        return $info;
    }
}
