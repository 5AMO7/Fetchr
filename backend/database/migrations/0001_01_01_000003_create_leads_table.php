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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('business_name');
            $table->string('reg_type')->nullable();
            $table->string('registration_number')->nullable();
            $table->string('email')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('website')->nullable();
            $table->string('facebook')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('instagram')->nullable();
            $table->string('twitter')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('industry')->nullable();
            $table->text('description')->nullable();
            $table->boolean('profitable')->nullable(); // true = works with profits, false = unprofitable
            $table->integer('employee_count')->nullable(); 
            $table->date('founded_date')->nullable();

            $table->string('source')->nullable(); // where the lead was found (firmas.lv, lursoft.lv, manual, goverment, scrape, etc.)
            $table->unsignedTinyInteger('confidence_score')->nullable(); // 0 - 100 (%)
            $table->timestamp('last_verified_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
