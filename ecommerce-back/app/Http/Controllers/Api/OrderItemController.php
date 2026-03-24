<?php

namespace App\Http\Controllers\Api;

use App\Models\OrderItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class OrderItemController extends Controller
{
    // Affiche le panier de l'utilisateur connecté
    public function myCart()
    {
        $user = Auth::user();

        // Récupère la commande "en cours" (par exemple status = 'pending')
        $order = Order::where('user_id', $user->id)
                      ->where('status', 'pending')
                      ->first();

        if (!$order) {
            return response()->json([]);
        }

        // Récupère tous les items de cette commande
        $items = OrderItem::where('order_id', $order->id)
                          ->with('product') // si tu as une relation product() dans OrderItem
                          ->get();

        return response()->json($items);
    }

    // Ajouter un produit au panier
    public function addToCart(Request $request)
    {
        $user = Auth::user();

        // récupère ou crée la commande en cours
        $order = Order::firstOrCreate(
            ['user_id' => $user->id, 'status' => 'pending'],
            ['total_price' => 0]
        );

        // Vérifie si le produit existe déjà dans le panier
        $item = OrderItem::where('order_id', $order->id)
                         ->where('product_id', $request->product_id)
                         ->first();

        if ($item) {
            $item->quantity += $request->quantity;
            $item->save();
        } else {
            $item = OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price' => $request->price
            ]);
        }

        // recalculer le total de la commande
        $order->total_price = OrderItem::where('order_id', $order->id)->sum('price');
        $order->save();

        return response()->json($item, 201);
    }

    // Supprimer un item du panier
    public function removeFromCart($id)
    {
        $item = OrderItem::findOrFail($id);
        $item->delete();
        return response()->json(null, 204);
    }

    // Mettre à jour la quantité
    public function updateQuantity(Request $request, $id)
    {
        $item = OrderItem::findOrFail($id);
        $item->quantity = $request->quantity;
        $item->save();
        return response()->json($item);
    }
}
