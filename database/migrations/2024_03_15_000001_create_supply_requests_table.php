<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supply_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('request_number')->unique();
            $table->string('department');
            $table->string('status')->default('pending');
            $table->text('purpose');
            $table->date('date_needed');
            $table->text('items_json'); // Store items as JSON array
            $table->decimal('total_amount', 10, 2);
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supply_requests');
    }
}; 