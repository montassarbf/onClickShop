import React, { useState, useEffect, useCallback } from "react";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useCart } from "../context/CartContext";
import { useProfile } from "../context/ProfileContext";

const sections = [
  { id: "Home", label: "Home" },
  { id: "Shop", label: "Shop" },
  { id: "Deals", label: "Deals" },
  { id: "new", label: "New Arrivals" },
  { id: "contact", label: "Contact" },
];

const CART_CACHE_KEY = "cart_count_cache";

const Navbar: React.FC = () => {
  const [active, setActive] = useState("Home");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { profileImage, setProfileImage } = useProfile();

  // ✅ Lire le counter depuis localStorage immédiatement (0 attente)
  const [apiCartTotal, setApiCartTotal] = useState<number>(
    () => Number(localStorage.getItem(CART_CACHE_KEY) || "0")
  );

  // Appel API en arrière-plan pour sync le vrai count
  const fetchApiCartCount = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { setApiCartTotal(0); return; }
    try {
      const res = await apiClient.get<Array<{ quantity: number }>>("/cart");
      const total = res.data.reduce((sum, row) => sum + Number(row.quantity), 0);
      localStorage.setItem(CART_CACHE_KEY, String(total));
      setApiCartTotal(total);
    } catch {
      setApiCartTotal(0);
    }
  }, []);

  // ✅ Charger profil depuis cache immédiatement, puis sync en arrière-plan
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Appel /me en arrière-plan uniquement si pas déjà en cache
    if (!profileImage) {
      apiClient.get("/me")
        .then((res) => {
          setIsLoggedIn(true);
          if (res.data.profile_image) {
            const img = res.data.profile_image.startsWith("http")
              ? res.data.profile_image
              : `http://127.0.0.1:8000/storage/${res.data.profile_image}`;
            setProfileImage(img);
          }
        })
        .catch(() => { setIsLoggedIn(false); });
    }
  }, []);

  // Sync cart count en arrière-plan
  useEffect(() => {
    fetchApiCartCount();
  }, [fetchApiCartCount, cartCount, location.pathname, isLoggedIn]);

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== "/") return;
      const scrollPos = window.scrollY + 120;
      let current = sections[0].id;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (scrollPos >= el.offsetTop) current = section.id;
      }
      setActive(current);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const displayCartCount = isLoggedIn ? apiCartTotal : cartCount;

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setActive(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(CART_CACHE_KEY);
    localStorage.removeItem("profile_image_url");
    setIsLoggedIn(false);
    setProfileImage("");
    navigate("/");
  };

  const [notifications] = useState([
    { id: 1, text: "Your order has shipped.", time: "2h ago", read: false },
    { id: 2, text: "Weekend sale: 20% off selected items.", time: "1d ago", read: false },
    { id: 3, text: "Welcome to Onclick Shop!", time: "3d ago", read: true },
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const avatarUrl = profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=profile";

  return (
    <div className="fixed top-0 left-0 right-0 navbar bg-white text-gray-800 shadow-sm pt-4 pb-3 px-4 lg:pr-10 w-full max-w-full mx-auto rounded-b-xl z-50 border-b border-gray-100/80">
      <div className="navbar-start flex-1 min-w-0">
        {/* Mobile menu */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="black">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box mt-3 w-52 p-2 shadow z-[60] border border-gray-100">
            {sections.map(item => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={e => { e.preventDefault(); scrollToSection(item.id); }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop menu */}
        <ul className="menu menu-horizontal px-1 hidden lg:flex gap-0 ml-4 xl:ml-10 flex-wrap">
          {sections.map(item => (
            <li key={item.id} className="px-2 xl:px-4">
              <button
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`relative font-medium transition-all duration-300 bg-transparent border-none cursor-pointer px-1 py-2 ${active === item.id ? "text-orange-400" : "text-gray-600 hover:text-orange-400"
                  }`}
              >
                {item.label}
                {active === item.id && (
                  <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-orange-400 rounded-full" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Logo */}
      <div className="navbar-center shrink-0">
        <button type="button" onClick={() => navigate("/")} className="hover:opacity-90 transition-opacity">
          <img src={logo} alt="Onclick Shop" className="w-20 md:w-24" />
        </button>
      </div>

      <div className="navbar-end flex-1 justify-end gap-1 sm:gap-2 min-w-0">
        {/* Cart button */}
        <button type="button" onClick={() => navigate("/cart")} title="Cart" className="btn btn-ghost btn-circle relative">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width={20} height={20} viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet" className="text-gray-800">
            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
              <path d="M164 5060 c-46 -14 -100 -79 -109 -129 -9 -53 25 -126 74 -158 31 -21 45 -23 176 -23 207 0 290 -32 352 -137 l28 -48 5 -1585 5 -1585 28 -82 c44 -131 154 -264 272 -330 13 -8 10 -18 -19 -73 -46 -86 -66 -170 -66 -270 0 -256 161 -477 405 -557 250 -81 527 19 673 244 63 98 87 187 86 318 0 93 -5 121 -27 181 -15 39 -27 74 -27 78 0 3 340 6 756 6 716 0 756 -1 749 -18 -55 -136 -70 -278 -40 -392 68 -263 296 -442 565 -443 110 0 182 17 282 70 127 66 233 194 279 335 34 103 34 253 0 356 -60 185 -202 322 -401 388 -52 18 -133 19 -1535 24 l-1480 5 -48 28 c-105 62 -137 145 -137 354 l0 143 1793 2 1792 3 75 27 c183 67 311 203 376 398 17 51 19 109 22 725 2 369 0 695 -3 725 -6 47 -13 61 -49 96 -29 30 -52 43 -81 48 -22 3 -899 96 -1950 206 -1050 110 -1925 203 -1942 206 l-33 5 0 181 c0 132 -4 197 -16 242 -51 199 -214 365 -414 422 -65 19 -368 29 -416 14z m1196 -1220 c157 -16 300 -32 318 -35 l32 -6 0 -350 0 -351 -62 6 c-35 3 -160 11 -278 16 -118 6 -248 13 -287 16 l-73 6 0 364 0 364 33 0 c17 0 160 -13 317 -30z m1034 -110 c159 -17 297 -30 307 -30 18 0 19 -15 19 -326 l0 -327 -82 6 c-46 3 -201 12 -345 19 l-263 12 0 343 0 343 38 -5 c20 -3 167 -19 326 -35z m1002 -105 c181 -19 330 -35 332 -35 1 0 2 -133 2 -295 l0 -295 -52 0 c-29 0 -168 7 -308 15 -140 8 -272 15 -292 15 l-38 0 0 315 c0 254 3 315 13 315 7 0 162 -16 343 -35z m1004 -105 c157 -16 300 -32 318 -35 l32 -6 0 -270 0 -271 -62 6 c-35 3 -160 11 -278 16 -118 6 -248 13 -287 16 l-73 6 0 284 0 284 33 0 c17 0 160 -13 317 -30z m-3045 -720 c116 -6 243 -13 283 -16 l72 -6 0 -349 0 -349 -350 0 -350 0 0 371 0 370 68 -5 c37 -4 162 -11 277 -16z m1045 -55 c140 -8 270 -15 288 -15 l32 0 0 -325 0 -325 -345 0 -345 0 0 340 0 340 58 0 c31 0 172 -7 312 -15z m1078 -57 l252 -12 0 -298 0 -298 -345 0 -345 0 0 316 0 317 93 -6 c50 -4 206 -12 345 -19z m917 -48 c116 -6 243 -13 283 -16 l74 -6 -4 -166 c-4 -188 -13 -220 -76 -285 -76 -79 -86 -82 -369 -85 l-253 -3 0 291 0 291 68 -5 c37 -4 162 -11 277 -16z m-2796 -1756 c46 -19 107 -78 134 -129 17 -31 22 -57 22 -115 0 -87 -20 -132 -82 -192 -95 -92 -236 -98 -344 -15 -98 74 -129 218 -71 327 65 125 211 178 341 124z m2560 0 c46 -19 107 -78 134 -129 30 -56 30 -174 0 -230 -83 -155 -267 -197 -404 -92 -98 74 -129 218 -71 327 65 125 211 178 341 124z" />
            </g>
          </svg>
          {displayCartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 min-h-[1.125rem] min-w-[1.125rem] px-1 flex items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-semibold leading-none tabular-nums">
              {displayCartCount > 99 ? "99+" : displayCartCount}
            </span>
          )}
        </button>

        {/* Notifications */}
        <div className="dropdown dropdown-end">
          <button type="button" tabIndex={0} className="btn btn-ghost btn-circle relative" title="Notifications">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="badge badge-xs badge-primary indicator-item border-0 bg-orange-500 text-white">{unreadCount}</span>
              )}
            </div>
          </button>
          <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-[60] w-72 p-0 shadow-lg border border-gray-100 mt-2">
            <li className="menu-title px-4 py-3 text-sm text-gray-700 border-b border-gray-100">Notifications</li>
            {notifications.map(n => (
              <li key={n.id} className="w-full">
                <a className={`rounded-none py-3 px-4 whitespace-normal ${!n.read ? "bg-orange-50/80" : ""}`}>
                  <span className="block text-sm text-gray-800">{n.text}</span>
                  <span className="text-xs text-gray-400 mt-1">{n.time}</span>
                </a>
              </li>
            ))}
            <li className="border-t border-gray-100">
              <button type="button" className="text-orange-500 text-sm py-2 justify-center" onClick={() => navigate("/settings")}>
                Notification settings
              </button>
            </li>
          </ul>
        </div>

        {/* Avatar / Login */}
        {isLoggedIn ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-orange-100 hover:ring-orange-300">
              <div className="w-10 rounded-full bg-gray-100 overflow-hidden">
                {/* ✅ Skeleton si pas encore chargé */}
                {profileImage ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="object-cover w-full h-full"
                    onError={e => { (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/avataaars/svg?seed=profile"; }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded-full" />
                )}
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-[60] mt-3 w-52 p-2 shadow-lg border border-gray-100">

              <li className="p-2">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3B3B3B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="5" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>

                  <span>Profile</span>
                </button>
              </li>

              <li className="p-2"><button type="button" onClick={() => navigate("/settings")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B3B3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-cog-icon lucide-user-round-cog"><path d="m14.305 19.53.923-.382" /><path d="m15.228 16.852-.923-.383" /><path d="m16.852 15.228-.383-.923" /><path d="m16.852 20.772-.383.924" /><path d="m19.148 15.228.383-.923" /><path d="m19.53 21.696-.382-.924" /><path d="M2 21a8 8 0 0 1 10.434-7.62" /><path d="m20.772 16.852.924-.383" /><path d="m20.772 19.148.924.383" /><circle cx="10" cy="8" r="5" /><circle cx="18" cy="18" r="3" /></svg>
                <span>Settings</span>
              </button>
              </li>
              <li className="p-2">
                <button type="button" className="text-error" onClick={handleLogout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  </svg>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2 sm:gap-3 items-center">
            <button type="button" className="btn btn-sm sm:btn-md rounded-full bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700 border border-gray-200/80 px-6 py-2.5 sm:px-8 sm:py-3 min-h-0 h-auto" onClick={() => navigate("/login")}>
              Login
            </button>
            <button type="button" className="btn btn-sm sm:btn-md rounded-full bg-orange-400 hover:bg-orange-500 text-white border-0 px-6 py-2.5 sm:px-8 sm:py-3 min-h-0 h-auto shadow-sm" onClick={() => navigate("/register")}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;