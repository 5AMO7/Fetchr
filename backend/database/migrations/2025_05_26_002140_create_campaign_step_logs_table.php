<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('campaign_step_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_step_id')->constrained()->onDelete('cascade');
            $table->foreignId('campaign_lead_id')->constrained('campaign_leads')->onDelete('cascade');
            $table->enum('status', ['pending', 'sent', 'opened', 'failed'])->default('pending');
            $table->timestamp('scheduled_at');
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('opened_at')->nullable();
            $table->timestamps();

            // Indexes for better performance
            $table->index(['campaign_step_id', 'campaign_lead_id']);
            $table->index('status');
            $table->index('scheduled_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_step_logs');
    }
};
