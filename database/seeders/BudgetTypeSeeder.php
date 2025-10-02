<?php

namespace Database\Seeders;

use App\Models\BudgetType;
use Illuminate\Database\Seeder;

class BudgetTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $budgetTypes = [
            'Operating Budget',
            'Human Resources Budget',
            'Petty Cash',
        ];


        foreach ($budgetTypes as $budgetType) {
            BudgetType::create([
                'name' => $budgetType,
            ]);
        }
    }
}
