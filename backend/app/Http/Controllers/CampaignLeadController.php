<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CampaignLead;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CampaignLeadController extends Controller
{
    /**
     * Display a listing of campaign leads for a specific campaign.
     */
    public function index(Campaign $campaign): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        $campaignLeads = $campaign->campaignLeads()
            ->with([
                'lead',
                'stepLogs' => function ($query) {
                    $query->with('campaignStep')->orderBy('created_at', 'desc');
                },
                'stepLogs.emailOpens'
            ])
            ->paginate(15);

        return response()->json($campaignLeads);
    }

    /**
     * Store a newly created campaign lead.
     */
    public function store(Request $request, Campaign $campaign): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        $validated = $request->validate([
            'lead_id' => 'required|exists:leads,id',
        ]);

        // Check if lead is already in the campaign
        $existingCampaignLead = $campaign->campaignLeads()
            ->where('lead_id', $validated['lead_id'])
            ->first();

        if ($existingCampaignLead) {
            return response()->json([
                'message' => 'Lead is already in this campaign',
                'campaign_lead' => $existingCampaignLead->load('lead')
            ], 409);
        }

        $campaignLead = $campaign->campaignLeads()->create($validated);
        $campaignLead->load('lead');

        return response()->json($campaignLead, 201);
    }

    /**
     * Display the specified campaign lead.
     */
    public function show(Campaign $campaign, CampaignLead $campaignLead): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        // Ensure the campaign lead belongs to the campaign
        if ($campaignLead->campaign_id !== $campaign->id) {
            return response()->json(['message' => 'Campaign lead not found'], 404);
        }

        $campaignLead->load([
            'lead',
            'stepLogs' => function ($query) {
                $query->with(['campaignStep', 'emailOpens'])->orderBy('created_at', 'desc');
            }
        ]);

        return response()->json($campaignLead);
    }

    /**
     * Remove the specified campaign lead.
     */
    public function destroy(Campaign $campaign, CampaignLead $campaignLead): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        // Ensure the campaign lead belongs to the campaign
        if ($campaignLead->campaign_id !== $campaign->id) {
            return response()->json(['message' => 'Campaign lead not found'], 404);
        }

        $campaignLead->delete();

        return response()->json(['message' => 'Lead removed from campaign successfully']);
    }

    /**
     * Get statistics for a specific campaign lead.
     */
    public function stats(Campaign $campaign, CampaignLead $campaignLead): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        // Ensure the campaign lead belongs to the campaign
        if ($campaignLead->campaign_id !== $campaign->id) {
            return response()->json(['message' => 'Campaign lead not found'], 404);
        }

        $stats = [
            'total_emails_sent' => $campaignLead->stepLogs()->where('status', 'sent')->count(),
            'total_emails_opened' => $campaignLead->stepLogs()->where('status', 'opened')->count(),
            'total_emails_failed' => $campaignLead->stepLogs()->where('status', 'failed')->count(),
            'total_emails_pending' => $campaignLead->stepLogs()->where('status', 'pending')->count(),
            'last_email_sent' => $campaignLead->stepLogs()
                ->where('status', 'sent')
                ->latest('sent_at')
                ->first()?->sent_at,
            'last_email_opened' => $campaignLead->stepLogs()
                ->where('status', 'opened')
                ->latest('opened_at')
                ->first()?->opened_at,
            'total_opens' => $campaignLead->emailOpens()->count(),
            'unique_opens' => $campaignLead->emailOpens()
                ->distinct('campaign_step_log_id')
                ->count(),
        ];

        $stats['open_rate'] = $stats['total_emails_sent'] > 0 
            ? round(($stats['total_emails_opened'] / $stats['total_emails_sent']) * 100, 2) 
            : 0;

        return response()->json($stats);
    }

    /**
     * Get the email timeline for a campaign lead.
     */
    public function timeline(Campaign $campaign, CampaignLead $campaignLead): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        // Ensure the campaign lead belongs to the campaign
        if ($campaignLead->campaign_id !== $campaign->id) {
            return response()->json(['message' => 'Campaign lead not found'], 404);
        }

        $timeline = $campaignLead->stepLogs()
            ->with(['campaignStep', 'emailOpens'])
            ->orderBy('scheduled_at')
            ->get()
            ->map(function ($stepLog) {
                return [
                    'id' => $stepLog->id,
                    'step' => $stepLog->campaignStep,
                    'status' => $stepLog->status,
                    'scheduled_at' => $stepLog->scheduled_at,
                    'sent_at' => $stepLog->sent_at,
                    'opened_at' => $stepLog->opened_at,
                    'opens_count' => $stepLog->emailOpens->count(),
                    'latest_open' => $stepLog->emailOpens->sortByDesc('opened_at')->first(),
                ];
            });

        return response()->json($timeline);
    }

    /**
     * Bulk operations on campaign leads.
     */
    public function bulk(Request $request, Campaign $campaign): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        $validated = $request->validate([
            'action' => 'required|in:add,remove',
            'lead_ids' => 'required|array',
            'lead_ids.*' => 'exists:leads,id',
        ]);

        $results = [
            'processed' => 0,
            'skipped' => 0,
            'errors' => []
        ];

        if ($validated['action'] === 'add') {
            foreach ($validated['lead_ids'] as $leadId) {
                $existing = $campaign->campaignLeads()->where('lead_id', $leadId)->exists();
                
                if ($existing) {
                    $results['skipped']++;
                } else {
                    $campaign->campaignLeads()->create(['lead_id' => $leadId]);
                    $results['processed']++;
                }
            }
            
            $message = "Added {$results['processed']} leads to campaign";
            if ($results['skipped'] > 0) {
                $message .= " ({$results['skipped']} already existed)";
            }
            
        } else { // remove
            $results['processed'] = $campaign->campaignLeads()
                ->whereIn('lead_id', $validated['lead_ids'])
                ->delete();
            
            $message = "Removed {$results['processed']} leads from campaign";
        }

        return response()->json([
            'message' => $message,
            'results' => $results
        ]);
    }
}
