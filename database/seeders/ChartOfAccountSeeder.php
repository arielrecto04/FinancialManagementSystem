<?php

namespace Database\Seeders;

use App\Models\ChartOfAccount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChartOfAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $chartOfAccounts = [
            [
                'name' => 'Cash',
                'code' => '1001',
                'type' => 'bank & cash',
            ],
            [
                'name' => 'Bank',
                'code' => '1002',
                'type' => 'bank & cash',
            ],
            [
                'name' => 'Accounts Receivable',
                'code' => '1003',
                'type' => 'receivable',
            ],
            [
                'name' => 'Accounts Payable',
                'code' => '1004',
                'type' => 'payable',
            ],
            [
                'name' => 'Outstanding Payment',
                'code' => '1005',
                'type' => 'payable',
            ],
            [
                'name' => 'Outstanding Receipt',
                'code' => '1006',
                'type' => 'receivable',
            ],
        ];

        foreach ($chartOfAccounts as $account) {
            ChartOfAccount::create([
                'name' => $account['name'],
                'code' => $account['code'],
                'allow_reconcile' => false,
                'currency' => 'PHP',
                'type' => $account['type'],
            ]);
        }
    }
}
