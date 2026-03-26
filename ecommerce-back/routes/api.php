<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\OrderItemController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [OrderItemController::class, 'myCart']);
    Route::post('/cart', [OrderItemController::class, 'addToCart']);
    Route::put('/cart/{id}', [OrderItemController::class, 'updateQuantity']);
    Route::delete('/cart/{id}', [OrderItemController::class, 'removeFromCart']);
    Route::post('/user/profile-image', [AuthController::class, 'updateProfileImage']); // ← ajouter

});

// PUBLIC ROUTES
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::post('/login', [AuthController::class, 'login']); 
Route::post('/register', [AuthController::class, 'register']); 

// PROTECTED ROUTES
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']); // logout nécessite token
    Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json([
        'id' => $request->user()->id,
        'name' => $request->user()->name,
        'email' => $request->user()->email,
        'profile_image' => $request->user()->profile_image, // <-- important
    ]);
});

    Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
});
