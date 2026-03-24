import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image_url: string;
  is_deal?: boolean;
  discount_percent?: number;
}

interface Categorie {
  id: number;
  name: string;
}

const sortedList = ["highest price", "lower price", "A-Z", "Z-A"];
type SortType = "---" | "highest price" | "lower price" | "A-Z" | "Z-A";

const ITEMS_PER_PAGE       = 8;
const PRODUCTS_CACHE_KEY   = "shop_products_cache";
const CATEGORIES_CACHE_KEY = "shop_categories_cache";

const readCache = <T,>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const writeCache = (key: string, data: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
};

// ── Alert Modal ──────────────────────────────────────────────────────────────
interface AlertModalProps { message: string; onClose: () => void; onLogin: () => void; }

const AlertModal: React.FC<AlertModalProps> = ({ message, onClose, onLogin }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5">
      <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#f97316" strokeWidth="2" />
          <path d="M12 8v4m0 4h.01" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-xl font-extrabold text-gray-900 text-center">You're not logged in</h2>
      <p className="text-gray-500 text-center text-sm leading-relaxed">{message}</p>
      <div className="flex flex-col w-full gap-3 mt-1">
        <button onClick={onLogin} className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition duration-200 shadow-md shadow-orange-200">Go to Login</button>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium transition duration-200">Cancel</button>
      </div>
    </div>
  </div>
);

const Shop: React.FC = () => {
  // ✅ Lire depuis localStorage immédiatement — 0ms au refresh
  const [products,    setProducts]    = useState<Product[]>  (() => readCache<Product>(PRODUCTS_CACHE_KEY));
  const [categories,  setCategories]  = useState<Categorie[]>(() => readCache<Categorie>(CATEGORIES_CACHE_KEY));
  const [loading,     setLoading]     = useState<boolean>(products.length === 0);

  const [selectedCat,   setSelectedCat]   = useState("All");
  const [searchTerm,    setSearchTerm]    = useState("");
  const [selectSorted,  setSelectSorted]  = useState<SortType>("---");
  const [currentPage,   setCurrentPage]   = useState(1);
  const [alertModal,    setAlertModal]    = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Fetch en arrière-plan — met à jour le cache sans bloquer l'UI
    api.get<Product[]>("/products")
      .then((res) => { setProducts(res.data); writeCache(PRODUCTS_CACHE_KEY, res.data); })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    api.get<Categorie[]>("/categories")
      .then((res) => { setCategories(res.data); writeCache(CATEGORIES_CACHE_KEY, res.data); })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => { setCurrentPage(1); }, [selectedCat, searchTerm, selectSorted]);

  const showAlert  = (message: string) => setAlertModal({ visible: true, message });
  const closeAlert = () => setAlertModal({ visible: false, message: "" });

  const handleAddToCart = async (product: Product) => {
    const token = localStorage.getItem("token");
    if (!token) { showAlert("Please log in to add items to your cart and start shopping."); return; }
    try {
      await api.post("/cart", { product_id: product.id, quantity: 1, price: product.price }, { headers: { Authorization: `Bearer ${token}` } });
      addToCart({ id: product.id, name: product.name, price: product.price, image_url: product.image_url });
    } catch (error) {
      console.error(error);
      showAlert("Something went wrong while adding the item. Please try again.");
    }
  };

  const filteredProducts = (
    selectedCat === "All"
      ? products.filter((p) => !p.is_deal && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : products.filter((p) =>
          !p.is_deal &&
          categories.find((cat) => cat.id === p.category_id)?.name === selectedCat &&
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
  ).sort((a, b) => {
    switch (selectSorted) {
      case "highest price": return b.price - a.price;
      case "lower price":   return a.price - b.price;
      case "A-Z":           return a.name.localeCompare(b.name);
      case "Z-A":           return b.name.localeCompare(a.name);
      default:              return 0;
    }
  });

  const totalPages        = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("Shop")?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Loading seulement si cache vide (premier chargement uniquement)
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-orange-400" />
    </div>
  );

  return (
    <>
      {alertModal.visible && (
        <AlertModal message={alertModal.message} onClose={closeAlert} onLogin={() => { closeAlert(); navigate("/login"); }} />
      )}

      <section id="Shop" className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="min-h-screen bg-gray-50 px-6 py-10 mt-10">

          <div className="max-w-7xl mx-auto mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Shop Our <span className="text-orange-400">Products</span>
            </h1>
            <p className="text-gray-600 mt-2">Discover premium products selected just for you</p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="justify-start items-center flex flex-wrap gap-4">
              <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="border rounded px-2 py-1 bg-gray-100 text-gray-600">
                <option value="All">All</option>
                {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
              <select value={selectSorted} onChange={(e) => setSelectSorted(e.target.value as SortType)} className="border rounded px-2 py-1 bg-gray-100 text-gray-600">
                <option value="---">---</option>
                {sortedList.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex justify-end">
              <div className="flex items-center border w-80 focus-within:border-orange-500 transition duration-300 pr-3 gap-2 bg-gray-100 border-gray-500/30 h-[35px] rounded-full overflow-hidden">
                <input type="text" placeholder="Search for products" className="w-full h-full pl-4 outline-none placeholder-gray-500 text-sm bg-gray-100" onChange={(e) => setSearchTerm(e.target.value)} />
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="#6B7280">
                  <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mb-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
            </span>{" "}
            of <span className="font-semibold text-gray-700">{filteredProducts.length}</span> products
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="card bg-white shadow-md hover:shadow-xl transition duration-300">
                <figure className="h-56 overflow-hidden">
                  <img
                    src={product.image_url || "https://ih1.redbubble.net/image.5103371828.7438/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"}
                    alt={product.name}
                    className="object-cover w-full h-full hover:scale-105 transition duration-300"
                  />
                </figure>
                <div className="card-body">
                  <span className="text-sm text-orange-400 font-medium">
                    {categories.find((cat) => cat.id === product.category_id)?.name}
                  </span>
                  <h2 className="card-title text-lg text-gray-800">{product.name}</h2>
                  <p className="text-gray-600 font-semibold text-lg">${product.price}</p>
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="rounded-lg relative w-36 h-10 cursor-pointer flex items-center border border-orange-500 bg-orange-500 group"
                      onClick={() => handleAddToCart(product)}
                    >
                      <span className="text-gray-200 font-semibold ml-8 transform transition-all duration-300">Add Item</span>
                      <span className="absolute right-0 h-full w-10 rounded-lg bg-orange-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                        <svg strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="white" fill="none" viewBox="0 0 24 24" height="24" width="24" className="w-full">
                          <circle r="1" cy="21" cx="9"></circle>
                          <circle r="1" cy="21" cx="20"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-7xl mx-auto">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>

        </div>
      </section>
    </>
  );
};

export default Shop;