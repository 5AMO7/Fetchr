<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'John',
            'lastname' => 'Snow',
            'email' => 'johnsnow@snow.com',
            'password' => Hash::make('parole123'),
            'role' => 'user',
        ]);

        // Call the AdminSeeder to create admin users
        $this->call(AdminSeeder::class);
        
        // Call the LeadsSeeder to create sample leads
        $this->call(LeadsSeeder::class);
    }
}
