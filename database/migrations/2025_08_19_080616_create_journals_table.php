<?php

use App\Models\ChartOfAccount;
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
        Schema::create('journals', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignIdFor(ChartOfAccount::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(ChartOfAccount::class, 'suspense_account_id')->nullable()->constrained('chart_of_accounts')->nullOnDelete();
            $table->string('code')->nullable();
            $table->string('type')->default('sales');
            $table->boolean('is_active')->default(true);
            $table->string('currency')->default('PHP');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journals');
    }
};
