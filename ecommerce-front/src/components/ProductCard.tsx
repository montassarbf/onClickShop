import React from "react";
import type { Product, Category } from "../types";
import { DEFAULT_PRODUCT_IMAGE } from "../constants";

interface ProductCardProps {
  product: Product;
  categories: Category[];
  /** Called when the user clicks "Add Item". */
  onAddToCart: (product: Product) => void;
  /** Optional: show a discount badge for deal products. */
  showDiscountBadge?: boolean;
}

/**
 * Reusable product card used in both Shop and Deals pages.
 * Displays the product image, category, name, price, and an add-to-cart button.
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categories,
  onAddToCart,
  showDiscountBadge = false,
}) => {
  const categoryName = categories.find(
    (cat) => cat.id === product.category_id
  )?.name;

  const discount = product.discount_percent ?? 0;
  const originalPrice =
    showDiscountBadge && discount > 0
      ? product.price / (1 - discount / 100)
      : null;

  return (
    <div className="card bg-white shadow-md hover:shadow-xl transition duration-300 relative overflow-visible">
      {/* Discount badge — only shown in Deals */}
      {showDiscountBadge && discount > 0 && (
        <div className="absolute -top-3 -right-3 z-10 w-14 h-14 rounded-full bg-orange-500 text-white flex flex-col items-center justify-center shadow-lg border-2 border-white">
          <span className="text-xs font-bold leading-none">-{discount}%</span>
          <span className="text-[10px] leading-none mt-0.5 opacity-90">OFF</span>
        </div>
      )}

      {/* Product image */}
      <figure className="h-56 overflow-hidden rounded-t-2xl">
        <img
          src={product.image_url || DEFAULT_PRODUCT_IMAGE}
          alt={product.name}
          className="object-cover w-full h-full hover:scale-105 transition duration-300"
        />
      </figure>

      {/* Card body */}
      <div className="card-body">
        {/* Category label */}
        <span className="text-sm text-orange-400 font-medium">
          {categoryName}
        </span>

        <h2 className="card-title text-lg text-gray-800">{product.name}</h2>

        {/* Price row */}
        <div className="flex items-center gap-2 mt-1">
          <p className="text-orange-500 font-bold text-xl">
            ${Number(product.price).toFixed(2)}
          </p>
          {originalPrice && (
            <p className="text-gray-400 text-sm line-through">
              ${originalPrice.toFixed(2)}
            </p>
          )}
        </div>

        {/* Add to cart button */}
        <div className="card-actions justify-end mt-4">
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            className="rounded-lg relative w-36 h-10 cursor-pointer flex items-center border border-orange-500 bg-orange-500 group"
            onClick={() => onAddToCart(product)}
          >
            <span className="text-gray-200 font-semibold ml-8 transform transition-all duration-300">
              Add Item
            </span>
            <span className="absolute right-0 h-full w-10 rounded-lg bg-orange-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
              <svg
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                stroke="white"
                fill="none"
                viewBox="0 0 24 24"
                height="24"
                width="24"
                className="w-full"
                aria-hidden="true"
              >
                <circle r="1" cy="21" cx="9" />
                <circle r="1" cy="21" cx="20" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
