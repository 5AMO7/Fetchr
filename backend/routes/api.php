<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailTemplateController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\CampaignStepController;
use App\Http\Controllers\CampaignLeadController;
use App\Http\Controllers\EmailTrackingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Email tracking (public route - no auth required)
Route::get('/email/track/{token}', [EmailTrackingController::class, 'trackOpen']);

Route::middleware('auth:sanctum')->post('/leads/save', [LeadController::class, 'save']);
Route::middleware('auth:sanctum')->post('/leads/unsave', [LeadController::class, 'unsave']);
Route::middleware('auth:sanctum')->get('/leads/saved', [LeadController::class, 'showSaved']);

// Interaction routes - accessible without authentication
Route::middleware('auth:sanctum')->get('/leads', [LeadController::class, 'index']);
Route::middleware('auth:sanctum')->get('/leads/{id}', [LeadController::class, 'show']); 

// Email Templates routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/email-templates', [EmailTemplateController::class, 'index']);
    Route::get('/email-templates/{id}', [EmailTemplateController::class, 'show']);
    Route::post('/email-templates', [EmailTemplateController::class, 'store']);
    Route::put('/email-templates/{id}', [EmailTemplateController::class, 'update']);
    Route::delete('/email-templates/{id}', [EmailTemplateController::class, 'destroy']);
});

// Campaign routes
Route::middleware('auth:sanctum')->group(function () {
    // Campaign CRUD
    Route::apiResource('campaigns', CampaignController::class);
    
    // Campaign additional actions
    Route::post('/campaigns/{campaign}/leads', [CampaignController::class, 'addLeads']);
    Route::delete('/campaigns/{campaign}/leads', [CampaignController::class, 'removeLeads']);
    Route::get('/campaigns/{campaign}/stats', [CampaignController::class, 'stats']);
    
    // Campaign Steps
    Route::get('/campaigns/{campaign}/steps', [CampaignStepController::class, 'index']);
    Route::post('/campaigns/{campaign}/steps', [CampaignStepController::class, 'store']);
    Route::get('/campaigns/{campaign}/steps/{step}', [CampaignStepController::class, 'show']);
    Route::put('/campaigns/{campaign}/steps/{step}', [CampaignStepController::class, 'update']);
    Route::delete('/campaigns/{campaign}/steps/{step}', [CampaignStepController::class, 'destroy']);
    Route::post('/campaigns/{campaign}/steps/reorder', [CampaignStepController::class, 'reorder']);
    Route::get('/campaigns/{campaign}/steps/{step}/preview', [CampaignStepController::class, 'preview']);
    
    // Campaign Leads
    Route::get('/campaigns/{campaign}/campaign-leads', [CampaignLeadController::class, 'index']);
    Route::post('/campaigns/{campaign}/campaign-leads', [CampaignLeadController::class, 'store']);
    Route::get('/campaigns/{campaign}/campaign-leads/{campaignLead}', [CampaignLeadController::class, 'show']);
    Route::delete('/campaigns/{campaign}/campaign-leads/{campaignLead}', [CampaignLeadController::class, 'destroy']);
    Route::get('/campaigns/{campaign}/campaign-leads/{campaignLead}/stats', [CampaignLeadController::class, 'stats']);
    Route::get('/campaigns/{campaign}/campaign-leads/{campaignLead}/timeline', [CampaignLeadController::class, 'timeline']);
    Route::post('/campaigns/{campaign}/campaign-leads/bulk', [CampaignLeadController::class, 'bulk']);
    
    // Email Tracking & Analytics
    Route::get('/campaign-step-logs/{campaignStepLog}/tracking-url', [EmailTrackingController::class, 'generateTrackingUrl']);
    Route::get('/campaign-step-logs/{campaignStepLog}/opens', [EmailTrackingController::class, 'getOpens']);
    Route::get('/email/campaign-stats', [EmailTrackingController::class, 'getCampaignOpenStats']);
});

// Protected routes - require authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/oauth/tokens', [AuthController::class, 'saveOAuthTokens']);
    Route::post('/oauth/google/callback', [AuthController::class, 'handleGoogleCallback']);
}); 
