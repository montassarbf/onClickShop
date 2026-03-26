<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // ✅ Ajouter seulement si la colonne n'existe pas
            if (!Schema::hasColumn('products', 'is_deal')) {
                $table->boolean('is_deal')->default(false)->after('stock');
            }
            if (!Schema::hasColumn('products', 'discount_percent')) {
                $table->unsignedTinyInteger('discount_percent')->default(0)->after('is_deal');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'is_deal')) {
                $table->dropColumn('is_deal');
            }
            if (Schema::hasColumn('products', 'discount_percent')) {
                $table->dropColumn('discount_percent');
            }
        });
    }
};