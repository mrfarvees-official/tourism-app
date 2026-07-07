<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class DestinationSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::query()->where('key', 'lanka-trails')->first();

        if (!$tenant) {
            return;
        }

        foreach (Destination::defaultSeedRows() as $row) {
            Destination::query()->updateOrCreate(
                [
                    'tenant_id' => $tenant->id,
                    'slug' => $row['slug'],
                ],
                [
                    'destination_name' => $row['destination_name'],
                    'description' => $row['description'],
                    'region' => $row['region'],
                    'province' => $row['province'],
                    'district' => $row['district'],
                    'best_time_to_visit' => $row['best_time_to_visit'],
                    'nearby_attractions' => $row['nearby_attractions'],
                    'latitude' => $row['latitude'],
                    'longitude' => $row['longitude'],
                    'image_url' => $row['image_url'],
                    'featured' => $row['featured'],
                    'status' => $row['status'],
                ],
            );
        }
    }
}
