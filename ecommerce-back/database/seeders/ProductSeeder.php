<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $products = [
    // Phones
    ['name' => 'iPhone 15', 'description' => 'Latest Apple smartphone', 'price' => 1200, 'stock' => 50, 'category_id' => 1, 'image_url' => "https://images.unsplash.com/photo-1695048132853-026f93f40f7f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGlQaG9uZSUyMDE1fGVufDB8fDB8fHww"],
    ['name' => 'Samsung Galaxy S23', 'description' => 'Premium Android smartphone', 'price' => 1100, 'stock' => 45, 'category_id' => 1, 'image_url' => "https://images.unsplash.com/photo-1707257724848-0ef129227838?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    ['name' => 'Google Pixel 8', 'description' => 'Google flagship smartphone', 'price' => 950, 'stock' => 35, 'category_id' => 1, 'image_url' => "https://images.unsplash.com/photo-1706412703794-d944cd3625b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8R29vZ2xlJTIwUGl4ZWwlMjA4fGVufDB8fDB8fHww"],
    ['name' => 'OnePlus 12', 'description' => 'High-speed Android device', 'price' => 799, 'stock' => 40, 'category_id' => 1, 'image_url' => "https://images.unsplash.com/photo-1658851362428-e136c3efad4b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    ['name' => 'Xiaomi 14 Pro', 'description' => 'Flagship-level specs at affordable price', 'price' => 749, 'stock' => 60, 'category_id' => 1, 'image_url' => "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fFhpYW9taSUyMDE0fGVufDB8fDB8fHww"],
    ['name' => 'Oppo Find X6', 'description' => 'Latest Oppo smartphone with AI camera', 'price' => 699, 'stock' => 55, 'category_id' => 1, 'image_url' => "https://images.unsplash.com/photo-1662371697742-b5b612c62629?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8T3Bwb3xlbnwwfHwwfHx8MA%3D%3D"],
    ['name' => 'Vivo X90', 'description' => 'High-performance Android device', 'price' => 650, 'stock' => 50, 'category_id' => 1, 'image_url' => "https://images.unsplash.com/photo-1746123726090-c8e262cb3341?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBob25lJTIwVml2b3xlbnwwfHwwfHx8MA%3D%3D"],
    ['name' => 'Huawei P60', 'description' => 'Flagship Huawei phone', 'price' => 700, 'stock' => 45, 'category_id' => 1, 'image_url' => "https://images.unsplash.com/photo-1546706887-a24528987a75?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEh1YXdlaXxlbnwwfHwwfHx8MA%3D%3D"],
    ['name' => 'Realme GT3', 'description' => 'Affordable high-spec smartphone', 'price' => 500, 'stock' => 70, 'category_id' => 1, 'image_url' => "https://images.unsplash.com/photo-1723310181273-da4c41f7cb10?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8UmVhbG1lfGVufDB8fDB8fHww"],
    ['name' => 'Asus ROG Phone 7', 'description' => 'Gaming smartphone with high refresh screen', 'price' => 900, 'stock' => 25, 'category_id' => 1, 'image_url' => "https://images.unsplash.com/photo-1732020883986-a251177053c4?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],

    // Laptops
    ['name' => 'MacBook Pro 16"', 'description' => 'Apple professional laptop', 'price' => 2499, 'stock' => 20, 'category_id' => 2, 'image_url' => "https://images.unsplash.com/photo-1651241680016-cc9e407e7dc3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8TWFjQm9vayUyMFByb3xlbnwwfHwwfHx8MA%3D%3D"],
    ['name' => 'Dell XPS 15', 'description' => 'High-performance Windows laptop', 'price' => 1999, 'stock' => 25, 'category_id' => 2, 'image_url' => "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fERlbGx8ZW58MHx8MHx8fDA%3D"],
    ['name' => 'HP Spectre x360', 'description' => 'Convertible touchscreen laptop', 'price' => 1799, 'stock' => 22, 'category_id' => 2, 'image_url' => "https://images.unsplash.com/photo-1658312226966-29bd4e77c62c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SFAlMjBTcGVjdHJlJTIweDM2MHxlbnwwfHwwfHx8MA%3D%3D"],
    ['name' => 'Lenovo ThinkPad X1', 'description' => 'Business-class ultraportable laptop', 'price' => 1599, 'stock' => 30, 'category_id' => 2, 'image_url' => "https://images.unsplash.com/photo-1763162410742-1d0097cea556?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TGVub3ZvJTIwVGhpbmtQYWR8ZW58MHx8MHx8fDA%3D"],
    ['name' => 'Asus ROG Strix', 'description' => 'Gaming laptop high refresh', 'price' => 2199, 'stock' => 15, 'category_id' => 2, 'image_url' => null],
    ['name' => 'Acer Swift 5', 'description' => 'Lightweight ultrabook', 'price' => 1099, 'stock' => 35, 'category_id' => 2, 'image_url' => null],
    ['name' => 'MSI Creator Z17', 'description' => 'Laptop for creators and designers', 'price' => 2299, 'stock' => 18, 'category_id' => 2, 'image_url' => null],
    ['name' => 'Razer Blade 16', 'description' => 'Gaming laptop with premium build', 'price' => 2499, 'stock' => 12, 'category_id' => 2, 'image_url' => null],
    ['name' => 'Microsoft Surface Laptop 6', 'description' => 'Sleek Windows ultrabook', 'price' => 1399, 'stock' => 28, 'category_id' => 2, 'image_url' => null],
    ['name' => 'HP Omen 16', 'description' => 'Gaming laptop with RTX GPU', 'price' => 1899, 'stock' => 20, 'category_id' => 2, 'image_url' => null],

    // Headphones
    ['name' => 'Sony WH-1000XM5', 'description' => 'Noise cancelling headphones', 'price' => 399, 'stock' => 80, 'category_id' => 3, 'image_url' => null],
    ['name' => 'Bose QuietComfort 45', 'description' => 'Comfortable over-ear headphones', 'price' => 349, 'stock' => 70, 'category_id' => 3, 'image_url' => null],
    ['name' => 'Apple AirPods Max', 'description' => 'Premium wireless headphones', 'price' => 549, 'stock' => 50, 'category_id' => 3, 'image_url' => null],
    ['name' => 'Audio-Technica ATH-M50x', 'description' => 'Professional studio headphones', 'price' => 149, 'stock' => 100, 'category_id' => 3, 'image_url' => null],
    ['name' => 'JBL Tune 760NC', 'description' => 'Noise cancelling Bluetooth headphones', 'price' => 129, 'stock' => 90, 'category_id' => 3, 'image_url' => null],
    ['name' => 'Sennheiser HD 560S', 'description' => 'High fidelity headphones', 'price' => 199, 'stock' => 60, 'category_id' => 3, 'image_url' => null],
    ['name' => 'Bang & Olufsen Beoplay H95', 'description' => 'Luxury noise cancelling headphones', 'price' => 799, 'stock' => 25, 'category_id' => 3, 'image_url' => null],
    ['name' => 'AKG K371', 'description' => 'Studio reference headphones', 'price' => 149, 'stock' => 55, 'category_id' => 3, 'image_url' => null],
    ['name' => 'Razer Kraken V3', 'description' => 'Gaming headphones RGB', 'price' => 129, 'stock' => 75, 'category_id' => 3, 'image_url' => null],
    ['name' => 'SteelSeries Arctis 7', 'description' => 'Wireless gaming headphones', 'price' => 149, 'stock' => 65, 'category_id' => 3, 'image_url' => null],

    // Accessories
    ['name' => 'Logitech MX Master 3', 'description' => 'Wireless ergonomic mouse', 'price' => 99, 'stock' => 150, 'category_id' => 4, 'image_url' => null],
    ['name' => 'Anker PowerCore 20000', 'description' => 'Portable power bank', 'price' => 49, 'stock' => 200, 'category_id' => 4, 'image_url' => null],
    ['name' => 'Samsung 1TB Portable SSD', 'description' => 'High speed external storage', 'price' => 150, 'stock' => 80, 'category_id' => 4, 'image_url' => null],
    ['name' => 'Apple Magic Mouse 2', 'description' => 'Wireless mouse for Mac', 'price' => 79, 'stock' => 120, 'category_id' => 4, 'image_url' => null],
    ['name' => 'Logitech C920 Webcam', 'description' => 'HD video webcam', 'price' => 69, 'stock' => 90, 'category_id' => 4, 'image_url' => null],
    ['name' => 'Corsair K70 Mechanical Keyboard', 'description' => 'RGB mechanical keyboard', 'price' => 129, 'stock' => 80, 'category_id' => 4, 'image_url' => null],
    ['name' => 'Razer BlackWidow V3', 'description' => 'Gaming mechanical keyboard', 'price' => 139, 'stock' => 70, 'category_id' => 4, 'image_url' => null],
    ['name' => 'HyperX Cloud Earbuds', 'description' => 'Gaming earbuds', 'price' => 59, 'stock' => 95, 'category_id' => 4, 'image_url' => null],
    ['name' => 'Anker USB-C Hub', 'description' => 'Multiport adapter', 'price' => 39, 'stock' => 110, 'category_id' => 4, 'image_url' => null],
    ['name' => 'Belkin Wireless Charger', 'description' => 'Fast wireless charger', 'price' => 29, 'stock' => 130, 'category_id' => 4, 'image_url' => null],

    // Electronics / Machines
    ['name' => 'Canon EOS R6', 'description' => 'Mirrorless camera', 'price' => 2500, 'stock' => 15, 'category_id' => 5, 'image_url' => null],
    ['name' => 'Nikon Z6 II', 'description' => 'Professional mirrorless camera', 'price' => 2000, 'stock' => 12, 'category_id' => 5, 'image_url' => null],
    ['name' => 'DJI Air 3 Drone', 'description' => 'Camera drone', 'price' => 1500, 'stock' => 18, 'category_id' => 5, 'image_url' => null],
    ['name' => 'GoPro HERO12', 'description' => 'Action camera', 'price' => 499, 'stock' => 50, 'category_id' => 5, 'image_url' => null],
    ['name' => 'Samsung Frame TV 55"', 'description' => 'Smart TV with art mode', 'price' => 1200, 'stock' => 20, 'category_id' => 5, 'image_url' => null],
    ['name' => 'LG OLED TV 65"', 'description' => 'High-end OLED display', 'price' => 1800, 'stock' => 15, 'category_id' => 5, 'image_url' => null],
    ['name' => 'Sony Alpha 7 IV', 'description' => 'Professional camera', 'price' => 2200, 'stock' => 10, 'category_id' => 5, 'image_url' => null],
    ['name' => 'Epson EcoTank Printer', 'description' => 'All-in-one printer', 'price' => 299, 'stock' => 30, 'category_id' => 5, 'image_url' => null],
    ['name' => 'Bissell Carpet Cleaner', 'description' => 'Home cleaning machine', 'price' => 199, 'stock' => 25, 'category_id' => 5, 'image_url' => null],
    ['name' => 'Philips Airfryer', 'description' => 'Healthy cooking machine', 'price' => 149, 'stock' => 40, 'category_id' => 5, 'image_url' => null],
];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
