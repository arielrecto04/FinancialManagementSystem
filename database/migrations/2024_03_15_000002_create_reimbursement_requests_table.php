<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reimbursement_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('request_number')->unique();
            $table->string('department');
            $table->string('status')->default('pending');
            $table->date('expense_date');
            $table->string('expense_type');
            $table->decimal('amount', 10, 2);
            $table->text('description');
            $table->string('receipt_path')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reimbursement_requests');
    }
}; 