<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->enum('type', ['Expense', 'Replenish']);
            $table->string('description');
            $table->string('requestNo', 50);
            $table->decimal('quantity', 10, 2);
            $table->decimal('amount', 10, 2);
            $table->enum('mop', ['CASH', 'CHECK', 'ONLINE']);
            $table->string('reference', 100);
            $table->string('category', 50);
            $table->string('receipt')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('expenses');
    }
};