<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('liquidations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('department');
            $table->date('date');
            $table->text('particulars');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('cash_advance_amount', 10, 2);
            $table->decimal('amount_to_refund', 10, 2)->default(0);
            $table->decimal('amount_to_reimburse', 10, 2)->default(0);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });

        Schema::create('liquidation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('liquidation_id')->constrained()->onDelete('cascade');
            $table->string('category', 50);
            $table->string('description');
            $table->decimal('amount', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('liquidation_items');
        Schema::dropIfExists('liquidations');
    }
}; 