<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Journal;

class JournalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $journals = [
           [
                'name' => 'Cash',
                'code' => '1001',
                'type' => 'Asset',
                'is_active' => true,
                'currency' => 'PHP',
           ],
           [
                'name' => 'Bank',
                'code' => '1002',
                'type' => 'Asset',
                'is_active' => true,
                'currency' => 'PHP',
           ],
           [
                'name' => 'Accounts Receivable',
                'code' => '1003',
                'type' => 'Asset',
                'is_active' => true,
                'currency' => 'PHP',
           ],
           [
                'name' => 'Accounts Payable',
                'code' => '1004',
                'type' => 'Asset',
                'is_active' => true,
                'currency' => 'PHP',
           ],
           [
                'name' => 'Outstanding Payment',
                'code' => '1005',
                'type' => 'Asset',
                'is_active' => true,
                'currency' => 'PHP',
           ],
           [
                'name' => 'Outstanding Receipt',
                'code' => '1006',
                'type' => 'Asset',
                'is_active' => true,
                'currency' => 'PHP',
           ],
        ];
    }
}
