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
        Schema::create('campaign_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->onDelete('cascade');
            $table->integer('step_order');
            $table->enum('type', ['email']); // Only email for now, but extensible
            $table->integer('delay_hours')->default(0);
            $table->string('subject');
            $table->text('body'); // Supports placeholders like {{lead.name}}
            $table->timestamps();

            // Index for better performance
            $table->index(['campaign_id', 'step_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_steps');
    }
};
