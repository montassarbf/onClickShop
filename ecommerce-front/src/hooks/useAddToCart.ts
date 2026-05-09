import { useState } from "react";
import api from "../api/apiClient";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";

interface UseAddToCartResult {
  /** Call this to add a product. Shows a modal if the user is not logged in. */
  handleAddToCart: (product: Product) => Promise<void>;
  /** Controls the "please log in" modal. */
  alertModal: { visible: boolean; message: string };
  closeAlert: () => void;
}

/**
 * Handles adding a product to the cart.
 *
 * - If the user is not logged in, shows a modal asking them to log in.
 * - If logged in, calls the API and updates the local cart context.
 */
export function useAddToCart(): UseAddToCartResult {
  const { addToCart } = useCart();

  const [alertModal, setAlertModal] = useState<{
    visible: boolean;
    message: string;
  }>({ visible: false, message: "" });

  const showAlert = (message: string) =>
    setAlertModal({ visible: true, message });

  const closeAlert = () => setAlertModal({ visible: false, message: "" });

  const handleAddToCart = async (product: Product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      showAlert("Please log in to add items to your cart and start shopping.");
      return;
    }

    try {
      await api.post("/cart", {
        product_id: product.id,
        quantity: 1,
        price: product.price,
      });

      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url ?? "",
      });
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      showAlert("Something went wrong while adding the item. Please try again.");
    }
  };

  return { handleAddToCart, alertModal, closeAlert };
}
