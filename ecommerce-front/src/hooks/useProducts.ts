import { useState, useEffect } from "react";
import api from "../api/apiClient";
import type { Product, Category } from "../types";
import { PRODUCTS_CACHE_KEY, CATEGORIES_CACHE_KEY } from "../constants";

// Generic helper to safely read JSON from localStorage.
function readCache<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Generic helper to safely write JSON to localStorage.
function writeCache(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Silently ignore if localStorage is full or unavailable.
  }
}

interface UseProductsResult {
  products: Product[];
  categories: Category[];
  loading: boolean;
}

/**
 * Fetches products and categories from the API.
 *
 * Strategy: show cached data instantly (no loading flash on revisit),
 * then refresh in the background so the cache stays up to date.
 */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>(() =>
    readCache<Product>(PRODUCTS_CACHE_KEY)
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    readCache<Category>(CATEGORIES_CACHE_KEY)
  );
  // Only show the loading spinner when there is nothing cached yet.
  const [loading, setLoading] = useState(products.length === 0);

  useEffect(() => {
    // Fetch products in the background, update cache when done.
    api
      .get<Product[]>("/products")
      .then((res) => {
        setProducts(res.data);
        writeCache(PRODUCTS_CACHE_KEY, res.data);
      })
      .catch((err) => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));

    // Fetch categories independently — they rarely change.
    api
      .get<Category[]>("/categories")
      .then((res) => {
        setCategories(res.data);
        writeCache(CATEGORIES_CACHE_KEY, res.data);
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  return { products, categories, loading };
}
