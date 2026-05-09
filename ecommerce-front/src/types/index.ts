// Shared TypeScript types used across the entire frontend.
// Define each type once here and import where needed.

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image_url: string | null;
  is_deal?: boolean;
  discount_percent?: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

export interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
  };
  quantity: number;
  price: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
}
