<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validation des champs
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Chercher l'utilisateur par email
        $user = User::where('email', $request->email)->first();

        // Vérifier si l'utilisateur existe et si le mot de passe correspond
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Créer un token pour l'utilisateur
        $token = $user->createToken('auth_token')->plainTextToken;

        // Retourner les infos utilisateur + token
        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function register(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Crée un token pour l'utilisateur
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }

    public function updateProfileImage(Request $request)
{
    $request->validate([
        'profile_image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048'
    ]);

    $user = $request->user();

    // Supprimer l'ancienne photo si elle existe
    if ($user->profile_image) {
        Storage::disk('public')->delete($user->profile_image);
    }

    // Sauvegarder la nouvelle
    $path = $request->file('profile_image')->store('profile_images', 'public');

    $user->update(['profile_image' => $path]);

    return response()->json([
        'message' => 'Profile image updated',
        'profile_image' => $path
    ]);
}
}
