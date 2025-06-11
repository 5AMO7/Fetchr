<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth-token')->plainTextToken
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth-token')->plainTextToken
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function saveOAuthTokens(Request $request)
    {
        $request->validate([
            'access_token' => 'required|string',
            'refresh_token' => 'required|string',
        ]);

        $user = $request->user();
        
        // Calculates token expiration time (1 hour)
        $expiresAt = Carbon::now()->addHour();
        
        $user->update([
            'gmail_access_token' => $request->access_token,
            'gmail_refresh_token' => $request->refresh_token,
            'gmail_token_expires_at' => $expiresAt,
        ]);

        return response()->json([
            'message' => 'OAuth tokens saved successfully',
            'expires_at' => $expiresAt->toISOString(),
        ]);
    }

    public function handleGoogleCallback(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        try {
            // Exchange authorization code for tokens
            $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'client_id' => env('GOOGLE_CLIENT_ID'),
                'client_secret' => env('GOOGLE_CLIENT_SECRET'),
                'code' => $request->code,
                'grant_type' => 'authorization_code',
                'redirect_uri' => env('GOOGLE_REDIRECT_URI', 'https://fetchr.pro/profile'),
            ]);

            if (!$response->successful()) {
                \Log::error('Google token exchange failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return response()->json([
                    'error' => 'Failed to exchange authorization code for tokens'
                ], 400);
            }

            $tokenData = $response->json();
            
            // Get user profile information using the access token
            $userInfoResponse = Http::withHeaders([
                'Authorization' => 'Bearer ' . $tokenData['access_token']
            ])->get('https://www.googleapis.com/oauth2/v2/userinfo');

            if (!$userInfoResponse->successful()) {
                \Log::error('Failed to fetch user profile', [
                    'status' => $userInfoResponse->status(),
                    'body' => $userInfoResponse->body()
                ]);
                return response()->json([
                    'error' => 'Failed to fetch user profile information'
                ], 400);
            }

            $userInfo = $userInfoResponse->json();
            
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'error' => 'User not authenticated'
                ], 401);
            }

            // Save Gmail tokens and profile info to user
            $expiresAt = now()->addSeconds($tokenData['expires_in'] ?? 3600);
            
            $user->update([
                'gmail_access_token' => $tokenData['access_token'],
                'gmail_refresh_token' => $tokenData['refresh_token'] ?? null,
                'gmail_token_expires_at' => $expiresAt,
                'gmail_account_email' => $userInfo['email'] ?? null,
                'gmail_account_name' => $userInfo['name'] ?? null,
                'gmail_account_picture' => $userInfo['picture'] ?? null,
            ]);

            return response()->json([
                'message' => 'Gmail account connected successfully',
                'expires_at' => $expiresAt->toISOString(),
                'scopes' => $tokenData['scope'] ?? 'email profile gmail.readonly gmail.compose',
                'account_info' => [
                    'email' => $userInfo['email'] ?? null,
                    'name' => $userInfo['name'] ?? null,
                    'picture' => $userInfo['picture'] ?? null,
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Google OAuth callback error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'OAuth authentication failed: ' . $e->getMessage()
            ], 500);
        }
    }
} 