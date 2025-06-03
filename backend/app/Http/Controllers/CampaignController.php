<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class CampaignController extends Controller
{
    /**
     * Display a listing of campaigns for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Campaign::where('user_id', Auth::id())
            ->with(['steps', 'campaignLeads.lead']);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by name if provided
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $campaigns = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($campaigns);
    }

    /**
     * Store a newly created campaign.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => ['nullable', Rule::in(['draft', 'active', 'completed'])],
        ]);

        $validated['user_id'] = Auth::id();
        $validated['status'] = $validated['status'] ?? 'draft';

        $campaign = Campaign::create($validated);
        $campaign->load(['steps', 'campaignLeads.lead']);

        return response()->json($campaign, 201);
    }

    /**
     * Display the specified campaign.
     */
    public function show(Campaign $campaign): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        $campaign->load([
            'steps' => function ($query) {
                $query->orderBy('step_order');
            },
            'campaignLeads.lead',
            'campaignLeads.stepLogs.campaignStep',
            'campaignLeads.stepLogs.emailOpens'
        ]);

        return response()->json($campaign);
    }

    /**
     * Update the specified campaign.
     */
    public function update(Request $request, Campaign $campaign): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => ['sometimes', Rule::in(['draft', 'active', 'completed'])],
        ]);

        $campaign->update($validated);
        $campaign->load(['steps', 'campaignLeads.lead']);

        return response()->json($campaign);
    }

    /**
     * Remove the specified campaign.
     */
    public function destroy(Campaign $campaign): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        $campaign->delete();

        return response()->json(['message' => 'Campaign deleted successfully']);
    }

    /**
     * Add leads to a campaign.
     */
    public function addLeads(Request $request, Campaign $campaign): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        $validated = $request->validate([
            'lead_ids' => 'required|array',
            'lead_ids.*' => 'exists:leads,id',
        ]);

        // Get leads that aren't already in the campaign
        $existingLeadIds = $campaign->campaignLeads()->pluck('lead_id')->toArray();
        $newLeadIds = array_diff($validated['lead_ids'], $existingLeadIds);

        // Add new leads to the campaign
        foreach ($newLeadIds as $leadId) {
            $campaign->campaignLeads()->create(['lead_id' => $leadId]);
        }

        $campaign->load(['campaignLeads.lead']);

        return response()->json([
            'message' => 'Leads added to campaign successfully',
            'added_count' => count($newLeadIds),
            'campaign' => $campaign
        ]);
    }

    /**
     * Remove leads from a campaign.
     */
    public function removeLeads(Request $request, Campaign $campaign): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        $validated = $request->validate([
            'lead_ids' => 'required|array',
            'lead_ids.*' => 'exists:leads,id',
        ]);

        $removedCount = $campaign->campaignLeads()
            ->whereIn('lead_id', $validated['lead_ids'])
            ->delete();

        return response()->json([
            'message' => 'Leads removed from campaign successfully',
            'removed_count' => $removedCount
        ]);
    }

    /**
     * Get campaign statistics.
     */
    public function stats(Campaign $campaign): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        $stats = [
            'total_leads' => $campaign->campaignLeads()->count(),
            'total_steps' => $campaign->steps()->count(),
            'emails_sent' => $campaign->campaignLeads()
                ->join('campaign_step_logs', 'campaign_leads.id', '=', 'campaign_step_logs.campaign_lead_id')
                ->where('campaign_step_logs.status', 'sent')
                ->count(),
            'emails_opened' => $campaign->campaignLeads()
                ->join('campaign_step_logs', 'campaign_leads.id', '=', 'campaign_step_logs.campaign_lead_id')
                ->where('campaign_step_logs.status', 'opened')
                ->count(),
            'emails_failed' => $campaign->campaignLeads()
                ->join('campaign_step_logs', 'campaign_leads.id', '=', 'campaign_step_logs.campaign_lead_id')
                ->where('campaign_step_logs.status', 'failed')
                ->count(),
        ];

        $stats['open_rate'] = $stats['emails_sent'] > 0 
            ? round(($stats['emails_opened'] / $stats['emails_sent']) * 100, 2) 
            : 0;

        return response()->json($stats);
    }
}
