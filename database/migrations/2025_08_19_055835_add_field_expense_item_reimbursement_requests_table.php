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
        Schema::table('reimbursement_requests', function (Blueprint $table) {
            $table->json('expense_items')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reimbursement_requests', function (Blueprint $table) {
            $table->dropColumn('expense_items');
        });
    }
};
