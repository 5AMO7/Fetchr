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
        Schema::create('campaign_lead', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('campaign_id');
            $table->unsignedBigInteger('lead_id');
            $table->unsignedBigInteger('email_template_id')->nullable();
            $table->enum('status', ['pending', 'sent', 'opened', 'clicked', 'responded', 'failed'])->default('pending');
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
            
            // Prevent duplicate leads in the same campaign
            $table->unique(['campaign_id', 'lead_id']);
        });

        // Add foreign key constraints separately
        Schema::table('campaign_lead', function (Blueprint $table) {
            $table->foreign('campaign_id')->references('id')->on('campaigns')->onDelete('cascade');
            $table->foreign('lead_id')->references('id')->on('leads')->onDelete('cascade');
            $table->foreign('email_template_id')->references('id')->on('email_templates')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_lead');
    }
}; 