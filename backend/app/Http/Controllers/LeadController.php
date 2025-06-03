<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\SavedLead;
use Illuminate\Http\Request;
use function Psy\debug;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::query();
        
        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('business_name', 'like', '%' . $searchTerm . '%')
                  ->orWhere('email', 'like', '%' . $searchTerm . '%')
                  ->orWhere('industry', 'like', '%' . $searchTerm . '%')
                  ->orWhere('city', 'like', '%' . $searchTerm . '%')
                  ->orWhere('country', 'like', '%' . $searchTerm . '%');
            });
        }

        // Check if pagination is requested
        $shouldPaginate = $request->has('page') || $request->has('per_page');
        
        if ($shouldPaginate) {
            // Pagination
            $perPage = $request->get('per_page', 15);
            $leads = $query->paginate($perPage);
            
            $user = auth('sanctum')->user();

            if ($user) {
                $savedLeadIds = $user->savedLeads()->pluck('lead_id')->toArray();

                // Add 'saved' attribute to each lead
                $leads->getCollection()->transform(function ($lead) use ($savedLeadIds) {
                    $lead->saved = in_array($lead->id, $savedLeadIds);
                    return $lead;
                });
            } else {
                // Add 'saved' = false for unauthenticated users
                $leads->getCollection()->transform(function ($lead) {
                    $lead->saved = false;
                    return $lead;
                });
            }

            return response()->json($leads);
        } else {
            // Return all leads as a simple array (backward compatibility)
            $leads = $query->get();
            $user = auth('sanctum')->user();

            if ($user) {
                $savedLeadIds = $user->savedLeads()->pluck('lead_id')->toArray();

                // Add 'saved' attribute to each lead
                $leads->transform(function ($lead) use ($savedLeadIds) {
                    $lead->saved = in_array($lead->id, $savedLeadIds);
                    return $lead;
                });
            } else {
                // Add 'saved' = false for unauthenticated users
                $leads->transform(function ($lead) {
                    $lead->saved = false;
                    return $lead;
                });
            }

            return response()->json($leads->values());
        }
    }

    public function show($id)
    {
        $lead = Lead::find($id);
        if (!$lead) {
            return response()->json(['message' => 'Lead not found'], 404);
        }
        
        $user = auth()->user();
        
        // If user is authenticated, check if lead is saved
        if ($user) {
            $saved = SavedLead::where('user_id', $user->id)
                ->where('lead_id', $lead->id)
                ->exists();
                
            $lead->saved = $saved;
        } else {
            $lead->saved = false;
        }
        
        return response()->json($lead);
    }

    public function save(Request $request)
    {
        // Checks the validity of the lead_id
        $request->validate([
            'lead_id' => 'required|integer|exists:leads,id',
            'notes' => 'nullable|string',
        ]);

        // Checks if user is authenticated
        $user = auth()->user();

        // Checks if there are no duplicates
        $alreadySaved = SavedLead::where('user_id', $user->id)
            ->where('lead_id', $request->lead_id)
            ->exists();
        
        if ($alreadySaved) {
            return response()->json(['message' => 'Lead already saved.'], 409);
        }

        // Saves the lead
        $savedLead = SavedLead::create([
            'user_id' => $user->id,
            'lead_id' => $request->lead_id,
            'notes' => $request->notes,
        ]);

        return response()->json(['message' => 'Lead saved successfully.', 'data' => $savedLead], 201);
    }

    public function unsave(Request $request)
    {
        // Validate the saved lead ID
        $request->validate([
            'saved_lead_id' => 'required|integer|exists:saved_leads,id',
        ]);

        // Get the authenticated user
        $user = auth()->user();

        // Find the saved lead
        $savedLead = SavedLead::where('id', $request->saved_lead_id)
                              ->where('user_id', $user->id)
                              ->first();

        // If saved lead doesn't exist or doesn't belong to user
        if (!$savedLead) {
            return response()->json(['message' => 'Saved lead not found or unauthorized.'], 404);
        }

        // Delete the saved lead
        $savedLead->delete();

        return response()->json(['message' => 'Lead unsaved successfully.'], 200);
    }

     public function showSaved(Request $request)
    {
        $user = auth()->user();
        
        $query = $user->savedLeads()->with('lead');
        
        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->whereHas('lead', function ($q) use ($searchTerm) {
                $q->where('business_name', 'like', '%' . $searchTerm . '%')
                  ->orWhere('email', 'like', '%' . $searchTerm . '%')
                  ->orWhere('industry', 'like', '%' . $searchTerm . '%')
                  ->orWhere('city', 'like', '%' . $searchTerm . '%')
                  ->orWhere('country', 'like', '%' . $searchTerm . '%');
            });
        }

        // Check if pagination is requested
        $shouldPaginate = $request->has('page') || $request->has('per_page');

        if ($shouldPaginate) {
            // Pagination
            $perPage = $request->get('per_page', 15);
            $savedLeads = $query->paginate($perPage);
            
            if ($savedLeads->isEmpty()) {
                return response()->json([
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => $perPage,
                    'total' => 0
                ]);
            }
            
            // Transform the paginated results to match the expected format
            $savedLeads->getCollection()->transform(function ($saved) {
                return [
                    'id' => $saved->lead->id, // Use the actual lead ID for selection
                    'saved_lead_id' => $saved->id, // Keep the saved_lead_id for reference
                    'notes' => $saved->notes,
                    'business_name' => $saved->lead->business_name,
                    'reg_type' => $saved->lead->reg_type,
                    'registration_number' => $saved->lead->registration_number,
                    'email' => $saved->lead->email,
                    'phone_number' => $saved->lead->phone_number,
                    'website' => $saved->lead->website,
                    'facebook' => $saved->lead->facebook,
                    'linkedin' => $saved->lead->linkedin,
                    'instagram' => $saved->lead->instagram,
                    'twitter' => $saved->lead->twitter,
                    'address' => $saved->lead->address,
                    'city' => $saved->lead->city,
                    'country' => $saved->lead->country,
                    'industry' => $saved->lead->industry,
                    'description' => $saved->lead->description,
                    'profitable' => $saved->lead->profitable,
                    'employee_count' => $saved->lead->employee_count,
                    'founded_date' => $saved->lead->founded_date,
                    'source' => $saved->lead->source,
                    'confidence_score' => $saved->lead->confidence_score,
                    'last_verified_at' => $saved->lead->last_verified_at,
                    'saved' => true,
                ];
            });
            
            return response()->json($savedLeads);
        } else {
            // Return all saved leads as a simple array (backward compatibility)
            $savedLeads = $query->get();
            
            if ($savedLeads->isEmpty()) {
                return response()->json([]);
            }
            
            return response()->json(
                $savedLeads->map(function ($saved) {
                    return [
                        'id' => $saved->id,
                        'lead_id' => $saved->lead->id, // Add lead_id for CompanyTable compatibility
                        'notes' => $saved->notes,
                        'business_name' => $saved->lead->business_name,
                        'reg_type' => $saved->lead->reg_type,
                        'registration_number' => $saved->lead->registration_number,
                        'email' => $saved->lead->email,
                        'phone_number' => $saved->lead->phone_number,
                        'website' => $saved->lead->website,
                        'facebook' => $saved->lead->facebook,
                        'linkedin' => $saved->lead->linkedin,
                        'instagram' => $saved->lead->instagram,
                        'twitter' => $saved->lead->twitter,
                        'address' => $saved->lead->address,
                        'city' => $saved->lead->city,
                        'country' => $saved->lead->country,
                        'industry' => $saved->lead->industry,
                        'description' => $saved->lead->description,
                        'profitable' => $saved->lead->profitable,
                        'employee_count' => $saved->lead->employee_count,
                        'founded_date' => $saved->lead->founded_date,
                        'source' => $saved->lead->source,
                        'confidence_score' => $saved->lead->confidence_score,
                        'last_verified_at' => $saved->lead->last_verified_at,
                        'saved' => true,
                    ];
                })
            );
        }
    }
} 