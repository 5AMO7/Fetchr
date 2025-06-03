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
        Schema::table('campaigns', function (Blueprint $table) {
            $table->text('description')->nullable()->after('name');
            // Update the status enum to match the specification
            $table->dropColumn('status');
        });
        
        Schema::table('campaigns', function (Blueprint $table) {
            $table->enum('status', ['draft', 'active', 'completed'])->default('draft')->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn(['description', 'status']);
        });
        
        Schema::table('campaigns', function (Blueprint $table) {
            $table->enum('status', ['draft', 'running', 'completed', 'paused'])->default('draft');
        });
    }
};
