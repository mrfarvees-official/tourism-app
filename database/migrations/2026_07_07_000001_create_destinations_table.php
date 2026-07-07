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
        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('slug', 191);
            $table->string('destination_name', 191);
            $table->text('description');
            $table->string('region', 191)->nullable();
            $table->string('province', 191)->nullable();
            $table->string('district', 191)->nullable();
            $table->string('best_time_to_visit', 191)->nullable();
            $table->text('nearby_attractions')->nullable();
            $table->decimal('latitude', 10, 6)->nullable();
            $table->decimal('longitude', 10, 6)->nullable();
            $table->string('image_url', 2048)->nullable();
            $table->boolean('featured')->default(false);
            $table->string('status', 24)->default('draft');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'slug'], 'unique_destination_slug_per_tenant');
            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'featured']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('destinations');
    }
};
