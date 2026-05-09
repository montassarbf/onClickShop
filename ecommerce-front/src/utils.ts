/**
 * Ensures the input is ALWAYS an array. 
 * Automatically handles Laravel-style { data: [...] } wrappers.
 */
export const safeArray = <T>(data: any): T[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.data)) {
    return data.data as T[];
  }
  return [];
};

/** Clears all app-related localStorage to ensure no 'poisoned' objects remain. */
export const clearOldCaches = () => {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (
      key.includes("cart") ||
      key.includes("product") ||
      key.includes("category") ||
      key.includes("profile")
    ) {
      localStorage.removeItem(key);
    }
  });
};
