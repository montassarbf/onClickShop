import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import LoadingSpinner from "../components/LoadingSpinner";
import type { OrderItem } from "../types";
import { safeArray } from "../utils";
import { CART_ITEMS_CACHE_KEY, DEFAULT_PRODUCT_IMAGE } from "../constants";

// ── Helpers ───────────────────────────────────────────────────────────────────

const readCartCache = (): OrderItem[] => {
  if (!localStorage.getItem("token")) return [];
  try {
    const raw = localStorage.getItem(CART_ITEMS_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeCartCache = (items: OrderItem[]) => {
  try {
    localStorage.setItem(CART_ITEMS_CACHE_KEY, JSON.stringify(items));
  } catch {}
};

// ── Payment method icons ───────────────────────────────────────────────────────

const VisaIcon = () => (
  <svg viewBox="0 0 48 48" width="42" height="28" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="6" fill="#1A1F71"/>
    <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">VISA</text>
  </svg>
);
const MastercardIcon = () => (
  <svg viewBox="0 0 48 48" width="42" height="28" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="6" fill="#252525"/>
    <circle cx="18" cy="24" r="10" fill="#EB001B"/>
    <circle cx="30" cy="24" r="10" fill="#F79E1B"/>
    <path d="M24 16.3a10 10 0 0 1 0 15.4A10 10 0 0 1 24 16.3z" fill="#FF5F00"/>
  </svg>
);
const PaypalIcon = () => (
  <svg viewBox="0 0 48 48" width="42" height="28" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="6" fill="#003087"/>
    <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fill="#009CDE" fontSize="11" fontWeight="bold" fontFamily="Arial">PayPal</text>
  </svg>
);
const AmexIcon = () => (
  <svg viewBox="0 0 48 48" width="42" height="28" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="6" fill="#2E77BC"/>
    <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">AMEX</text>
  </svg>
);

type PaymentMethod = "visa" | "mastercard" | "paypal" | "amex";

// ── Cart icon ─────────────────────────────────────────────────────────────────

const CartEmptyState = ({ onLogin }: { onLogin: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" className="text-gray-300" aria-hidden="true">
      <circle r="1" cy="21" cx="9" stroke="currentColor" strokeWidth="1.5"/>
      <circle r="1" cy="21" cx="20" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
    <p className="text-gray-500 text-lg font-medium">Please login to view your cart.</p>
    <button
      type="button"
      className="btn rounded-full bg-orange-400 hover:bg-orange-500 text-white border-0 px-8"
      onClick={onLogin}
    >
      Login
    </button>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const Cart: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const { removeProductFromCart, clearCart } = useCart();

  const [orderItems, setOrderItems] = useState<OrderItem[]>(readCartCache);
  const [loading, setLoading] = useState(isLoggedIn && orderItems.length === 0);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [payEmail, setPayEmail] = useState("");

  const updateItems = (items: OrderItem[]) => {
    writeCartCache(items);
    setOrderItems(items);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    api
      .get<OrderItem[]>("/cart")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data as any)?.data;
        if (Array.isArray(data)) {
          updateItems(data);
        } else {
          console.error("Cart API returned invalid data", res.data);
          updateItems([]);
        }
      })
      .catch((err) => console.error("Failed to fetch cart:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (orderItemId: number, productId: number) => {
    try {
      removeProductFromCart(productId);
      updateItems(safeArray<OrderItem>(orderItems).filter((item) => item.id !== orderItemId));
      await api.delete(`/cart/${orderItemId}`);
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    }
  };

  const handleCheckout = async () => {
    try {
      await api.post("/orders", {
        items: safeArray<OrderItem>(orderItems).map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      localStorage.removeItem(CART_ITEMS_CACHE_KEY);
      setOrderItems([]);
      clearCart();
      setOrderSuccess(true);
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
  };

  // Computed totals
  const total = safeArray<OrderItem>(orderItems).reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const shipping = total > 0 ? 9.99 : 0;
  const grandTotal = total + shipping;
  const isCardMethod = paymentMethod !== "paypal";

  // ── Render guards ───────────────────────────────────────────────────────────

  if (loading) return <LoadingSpinner />;

  if (!isLoggedIn) return <CartEmptyState onLogin={() => navigate("/login")} />;

  return (
    <section className="min-h-screen bg-gray-50 px-4 sm:px-10 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800">
          Your <span className="text-orange-400">Cart</span>
        </h1>

        {/* Order success banner */}
        {orderSuccess && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 text-green-800 px-6 py-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.042-.133-2.052-.382-3.016z" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium">Order placed successfully! Thank you for shopping with us.</span>
          </div>
        )}

        {orderItems.length === 0 && !orderSuccess ? (
          // Empty cart state
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" className="text-gray-300" aria-hidden="true">
              <circle r="1" cy="21" cx="9" stroke="currentColor" strokeWidth="1.5"/>
              <circle r="1" cy="21" cx="20" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="text-gray-400 text-lg font-medium">Your cart is empty.</p>
          </div>
        ) : orderItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left column: items + order summary */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {safeArray<OrderItem>(orderItems).map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow-md hover:shadow-xl transition duration-300 rounded-2xl p-4 flex items-center gap-4 border border-gray-100"
                >
                  <img
                    src={item.product.image_url || DEFAULT_PRODUCT_IMAGE}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{item.product.name}</h3>
                    <p className="text-orange-500 font-bold mt-1">${Number(item.price).toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="font-bold text-gray-700">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      aria-label={`Remove ${item.product.name} from cart`}
                      onClick={() => handleRemove(item.id, item.product.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* Order summary */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mt-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="flex justify-between text-gray-500 text-sm mb-2">
                  <span>Subtotal</span><span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm mb-4">
                  <span>Shipping</span><span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-800 text-lg">
                  <span>Total</span>
                  <span className="text-orange-500">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Right column: payment panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Payment</h2>

                {/* Payment method selector */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {(["visa", "mastercard", "paypal", "amex"] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      aria-label={method}
                      aria-pressed={paymentMethod === method}
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-xl p-1.5 flex items-center justify-center border-2 transition duration-200 ${
                        paymentMethod === method
                          ? "border-orange-400 bg-orange-50 shadow-sm"
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      {method === "visa"       && <VisaIcon />}
                      {method === "mastercard" && <MastercardIcon />}
                      {method === "paypal"     && <PaypalIcon />}
                      {method === "amex"       && <AmexIcon />}
                    </button>
                  ))}
                </div>

                {/* Card fields */}
                {isCardMethod && (
                  <div className="flex flex-col gap-4">
                    {/* Card preview */}
                    <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-5 shadow-lg mb-2">
                      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
                      <div className="absolute -bottom-8 -right-2 w-40 h-40 rounded-full bg-white/5" />
                      <div className="w-8 h-6 rounded bg-yellow-400/80 mb-3 flex items-center justify-center">
                        <div className="w-5 h-4 rounded-sm border border-yellow-600/50 grid grid-cols-2 gap-px p-px">
                          <div className="bg-yellow-500/60 rounded-sm"/><div className="bg-yellow-500/60 rounded-sm"/>
                          <div className="bg-yellow-500/60 rounded-sm"/><div className="bg-yellow-500/60 rounded-sm"/>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm font-mono tracking-widest">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </p>
                      <div className="flex justify-between mt-2">
                        <p className="text-white/60 text-xs uppercase tracking-wider">{cardName || "YOUR NAME"}</p>
                        <p className="text-white/60 text-xs">{expiry || "MM/YY"}</p>
                      </div>
                      <div className="absolute top-4 right-4 opacity-80">
                        {paymentMethod === "visa"       && <VisaIcon />}
                        {paymentMethod === "mastercard" && <MastercardIcon />}
                        {paymentMethod === "amex"       && <AmexIcon />}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-medium mb-1 block">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium mb-1 block">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition bg-gray-50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 font-medium mb-1 block">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium mb-1 block">CVV</label>
                        <div className="relative">
                          <input
                            type={showCvv ? "text" : "password"}
                            placeholder="•••"
                            maxLength={4}
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition bg-gray-50 pr-9"
                          />
                          <button
                            type="button"
                            aria-label={showCvv ? "Hide CVV" : "Show CVV"}
                            onClick={() => setShowCvv(!showCvv)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                              {showCvv
                                ? <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486zM11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829zM3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                : <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8zM8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                              }
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal section */}
                {paymentMethod === "paypal" && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col items-center gap-3">
                      <PaypalIcon />
                      <p className="text-sm text-gray-600 text-center">
                        You will be redirected to PayPal to complete your payment securely.
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium mb-1 block">PayPal Email</label>
                      <input
                        type="email"
                        placeholder="you@paypal.com"
                        value={payEmail}
                        onChange={(e) => setPayEmail(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition bg-gray-50"
                      />
                    </div>
                  </div>
                )}

                {/* SSL badge */}
                <div className="flex items-center gap-2 mt-5 mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#6b7280" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .201 0q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524z"/>
                  </svg>
                  <span className="text-xs text-gray-400">256-bit SSL encryption — your data is safe</span>
                </div>

                {/* Place order button */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base transition duration-200 shadow-md shadow-orange-200 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.042-.133-2.052-.382-3.016z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Place Order · ${grandTotal.toFixed(2)}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  This is a demo — no real payment will be processed.
                </p>
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Cart;