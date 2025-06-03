<?php

namespace App\Http\Controllers;

use App\Models\EmailTemplate;
use Illuminate\Http\Request;

class EmailTemplateController extends Controller
{
    /**
     * Display a listing of the email templates.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = auth()->user();
        $templates = EmailTemplate::where('user_id', $user->id)->get();
        return response()->json($templates);
    }

    /**
     * Store a newly created email template in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $user = auth()->user();
        $template = new EmailTemplate($validated);
        $template->user_id = $user->id;
        $template->save();

        return response()->json($template, 201);
    }

    /**
     * Display the specified email template.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = auth()->user();
        $template = EmailTemplate::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
        
        if (!$template) {
            return response()->json(['message' => 'Email template not found'], 404);
        }
        
        return response()->json($template);
    }

    /**
     * Update the specified email template in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $template = EmailTemplate::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
        
        if (!$template) {
            return response()->json(['message' => 'Email template not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'subject' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
        ]);

        $template->update($validated);
        
        return response()->json($template);
    }

    /**
     * Remove the specified email template from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = auth()->user();
        $template = EmailTemplate::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
        
        if (!$template) {
            return response()->json(['message' => 'Email template not found'], 404);
        }
        
        $template->delete();
        
        return response()->json(['message' => 'Email template deleted successfully']);
    }
} 