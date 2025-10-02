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
        Schema::create('budget_type_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_type_id')->constrained()->cascadeOnDelete();
            $table->string('expense_model');
            $table->string('name');
            $table->boolean('is_expense')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budget_type_expenses');
    }
};
