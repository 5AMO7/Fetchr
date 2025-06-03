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
        Schema::create('email_opens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_step_log_id')->constrained()->onDelete('cascade');
            $table->foreignId('lead_id')->constrained()->onDelete('cascade');
            $table->string('ip_address');
            $table->text('user_agent');
            $table->timestamp('opened_at');
            $table->timestamp('created_at')->useCurrent();

            // Indexes for better performance
            $table->index('campaign_step_log_id');
            $table->index('lead_id');
            $table->index('opened_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_opens');
    }
};
