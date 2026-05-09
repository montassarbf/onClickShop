import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertModal from "../components/AlertModal";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { useAddToCart } from "../hooks/useAddToCart";
import { ITEMS_PER_PAGE } from "../constants";

const SORT_OPTIONS = ["highest price", "lower price", "A-Z", "Z-A"] as const;
type SortType = "---" | (typeof SORT_OPTIONS)[number];

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const { products, categories, loading } = useProducts();
  const { handleAddToCart, alertModal, closeAlert } = useAddToCart();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortType>("---");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortOrder]);

  const filteredProducts = products
    .filter((p) => {
      if (p.is_deal) return false;
      if (!p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (selectedCategory === "All") return true;
      return categories.find((cat) => cat.id === p.category_id)?.name === selectedCategory;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "highest price": return b.price - a.price;
        case "lower price":   return a.price - b.price;
        case "A-Z":           return a.name.localeCompare(b.name);
        case "Z-A":           return b.name.localeCompare(a.name);
        default:              return 0;
      }
    });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("Shop")?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      {alertModal.visible && (
        <AlertModal
          message={alertModal.message}
          onClose={closeAlert}
          onLogin={() => { closeAlert(); navigate("/login"); }}
        />
      )}

      <section id="Shop" className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="min-h-screen bg-gray-50 px-6 py-10 mt-10">

          {/* Section heading */}
          <div className="max-w-7xl mx-auto mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Shop Our <span className="text-orange-400">Products</span>
            </h1>
            <p className="text-gray-600 mt-2">Discover premium products selected just for you</p>
          </div>

          {/* Filters row */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded px-2 py-1 bg-gray-100 text-gray-600"
                aria-label="Filter by category"
              >
                <option value="All">All</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortType)}
                className="border rounded px-2 py-1 bg-gray-100 text-gray-600"
                aria-label="Sort products"
              >
                <option value="---">---</option>
                {SORT_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="flex justify-end">
              <div className="flex items-center border w-80 focus-within:border-orange-500 transition duration-300 pr-3 gap-2 bg-gray-100 border-gray-500/30 h-[35px] rounded-full overflow-hidden">
                <input
                  type="text"
                  placeholder="Search for products"
                  aria-label="Search products"
                  className="w-full h-full pl-4 outline-none placeholder-gray-500 text-sm bg-gray-100"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="#6B7280" aria-hidden="true">
                  <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="max-w-7xl mx-auto mb-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredProducts.length === 0
                ? 0
                : (currentPage - 1) * ITEMS_PER_PAGE + 1}
              –{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">{filteredProducts.length}</span>{" "}
            products
          </div>

          {/* Products grid */}
          {filteredProducts.length === 0 ? (
            <div className="max-w-7xl mx-auto text-center py-20 text-gray-400">
              No products found. Try a different search or category.
            </div>
          ) : (
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categories={categories}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="max-w-7xl mx-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

        </div>
      </section>
    </>
  );
};

export default Shop;