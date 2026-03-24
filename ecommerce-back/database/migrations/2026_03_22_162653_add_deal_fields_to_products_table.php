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
    Schema::table('products', function (Blueprint $table) {
        $table->boolean('is_deal')->default(false)->after('stock');
        $table->unsignedTinyInteger('discount_percent')->default(0)->after('is_deal');
    });
}

public function down(): void
{
    Schema::table('products', function (Blueprint $table) {
        $table->dropColumn(['is_deal', 'discount_percent']);
    });
}
};
