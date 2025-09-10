<?php

use App\Models\ChartOfAccount;
use App\Models\JournalEntry;
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
        Schema::create('journal_items', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ChartOfAccount::class)->constrained()->cascadeOnDelete();
            // $table->foreignId('partner_id')->nullable()->constrained()->nullOnDelete();
            $table->string('label');
            $table->decimal('debit', 10, 2);
            $table->decimal('credit', 10, 2);
            $table->string('move_line')->nullable();
            $table->foreignIdFor(JournalEntry::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journal_items');
    }
};
