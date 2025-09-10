<?php

use App\Models\ChartOfAccount;
use App\Models\Journal;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignIdFor(ChartOfAccount::class, "outstanding_account_id")->nullable()->constrained('chart_of_accounts')->nullOnDelete();
            $table->string('type')->default('incoming');
            $table->boolean('is_active')->default(true);
            $table->string('currency')->default('PHP');
            $table->foreignIdFor(Journal::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
