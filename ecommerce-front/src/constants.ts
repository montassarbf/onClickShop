// App-wide constants — add new ones here instead of scattering them across files.

/** Fallback avatar shown when a user has no profile photo. */
export const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=profile";

/** Fallback product image shown when a product has no image_url. */
export const DEFAULT_PRODUCT_IMAGE =
  "https://ih1.redbubble.net/image.5103371828.7438/flat,750x,075,f-pad,750x1000,f8f8f8.jpg";

/** Number of products shown per page in Shop and Deals. */
export const ITEMS_PER_PAGE = 8;

/** localStorage key for the cached cart count badge. */
export const CART_COUNT_CACHE_KEY = "cart_count_cache";

/** localStorage key for the cached cart order items. */
export const CART_ITEMS_CACHE_KEY = "cart_order_items_cache";

/** localStorage key for the local cart (guest + logged-in). */
export const CART_LOCAL_KEY = "cart_items";

/** localStorage key for the cached profile image URL. */
export const PROFILE_IMAGE_CACHE_KEY = "profile_image_url";

/** localStorage key for products cache. */
export const PRODUCTS_CACHE_KEY = "shop_products_cache";

/** localStorage key for categories cache. */
export const CATEGORIES_CACHE_KEY = "shop_categories_cache";
