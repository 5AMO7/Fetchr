<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CampaignStep;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class CampaignStepController extends Controller
{
    /**
     * Display a listing of campaign steps for a specific campaign.
     */
    public function index(Campaign $campaign): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        $steps = $campaign->steps()->orderBy('step_order')->get();

        return response()->json($steps);
    }

    /**
     * Store a newly created campaign step.
     */
    public function store(Request $request, Campaign $campaign): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        $validated = $request->validate([
            'step_order' => 'required|integer|min:1',
            'type' => ['required', Rule::in(['email'])],
            'delay_hours' => 'required|integer|min:0',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        // Check if step_order already exists for this campaign
        $existingStep = $campaign->steps()->where('step_order', $validated['step_order'])->first();
        if ($existingStep) {
            return response()->json([
                'message' => 'A step with this order already exists',
                'errors' => ['step_order' => ['Step order must be unique within the campaign']]
            ], 422);
        }

        $validated['campaign_id'] = $campaign->id;
        $step = CampaignStep::create($validated);

        return response()->json($step, 201);
    }

    /**
     * Display the specified campaign step.
     */
    public function show(Campaign $campaign, CampaignStep $step): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        // Ensure the step belongs to the campaign
        if ($step->campaign_id !== $campaign->id) {
            return response()->json(['message' => 'Step not found'], 404);
        }

        $step->load(['stepLogs.campaignLead.lead']);

        return response()->json($step);
    }

    /**
     * Update the specified campaign step.
     */
    public function update(Request $request, Campaign $campaign, CampaignStep $step): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        // Ensure the step belongs to the campaign
        if ($step->campaign_id !== $campaign->id) {
            return response()->json(['message' => 'Step not found'], 404);
        }

        $validated = $request->validate([
            'step_order' => 'sometimes|required|integer|min:1',
            'type' => ['sometimes', 'required', Rule::in(['email'])],
            'delay_hours' => 'sometimes|required|integer|min:0',
            'subject' => 'sometimes|required|string|max:255',
            'body' => 'sometimes|required|string',
        ]);

        // Check if step_order already exists for this campaign (excluding current step)
        if (isset($validated['step_order'])) {
            $existingStep = $campaign->steps()
                ->where('step_order', $validated['step_order'])
                ->where('id', '!=', $step->id)
                ->first();
            
            if ($existingStep) {
                return response()->json([
                    'message' => 'A step with this order already exists',
                    'errors' => ['step_order' => ['Step order must be unique within the campaign']]
                ], 422);
            }
        }

        $step->update($validated);

        return response()->json($step);
    }

    /**
     * Remove the specified campaign step.
     */
    public function destroy(Campaign $campaign, CampaignStep $step): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        // Ensure the step belongs to the campaign
        if ($step->campaign_id !== $campaign->id) {
            return response()->json(['message' => 'Step not found'], 404);
        }

        $step->delete();

        return response()->json(['message' => 'Campaign step deleted successfully']);
    }

    /**
     * Reorder campaign steps.
     */
    public function reorder(Request $request, Campaign $campaign): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        $validated = $request->validate([
            'steps' => 'required|array',
            'steps.*.id' => 'required|exists:campaign_steps,id',
            'steps.*.step_order' => 'required|integer|min:1',
        ]);

        // Verify all steps belong to this campaign
        $stepIds = collect($validated['steps'])->pluck('id');
        $campaignStepIds = $campaign->steps()->pluck('id');
        
        if ($stepIds->diff($campaignStepIds)->isNotEmpty()) {
            return response()->json(['message' => 'Some steps do not belong to this campaign'], 422);
        }

        // Update step orders
        foreach ($validated['steps'] as $stepData) {
            CampaignStep::where('id', $stepData['id'])
                ->update(['step_order' => $stepData['step_order']]);
        }

        $steps = $campaign->steps()->orderBy('step_order')->get();

        return response()->json([
            'message' => 'Steps reordered successfully',
            'steps' => $steps
        ]);
    }

    /**
     * Preview processed email content for a step with sample lead data.
     */
    public function preview(Request $request, Campaign $campaign, CampaignStep $step): JsonResponse
    {
        // Ensure the campaign belongs to the authenticated user
        if ($campaign->user_id !== Auth::id()) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        // Ensure the step belongs to the campaign
        if ($step->campaign_id !== $campaign->id) {
            return response()->json(['message' => 'Step not found'], 404);
        }

        $validated = $request->validate([
            'lead_id' => 'sometimes|exists:leads,id',
        ]);

        // Use provided lead or get a sample lead from the campaign
        if (isset($validated['lead_id'])) {
            $lead = $campaign->leads()->find($validated['lead_id']);
        } else {
            $lead = $campaign->leads()->first();
        }

        if (!$lead) {
            return response()->json(['message' => 'No lead available for preview'], 404);
        }

        $preview = [
            'subject' => $step->getProcessedSubject($lead),
            'body' => $step->getProcessedBody($lead),
            'lead' => $lead,
        ];

        return response()->json($preview);
    }
}
