<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdminBudget;

class AdminBudgetSeeder extends Seeder
{
    public function run()
    {
        AdminBudget::create([
            'user_id' => 1, // Make sure this matches your admin user ID
            'total_budget' => 1000000,
            'remaining_budget' => 1000000,
            'used_budget' => 0
        ]);
    }
} 