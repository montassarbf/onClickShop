/**
 * Safely converts any value to an array.
 * If the value is an array, it is returned as-is.
 * If the value is undefined, null, or any other type, an empty array is returned.
 * This prevents crashes when running array methods like .map() or .filter() on API data.
 */
export const safeArray = <T>(data: T[] | unknown | any): T[] => {
  return Array.isArray(data) ? data : [];
};
