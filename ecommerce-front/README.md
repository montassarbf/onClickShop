# 🛒 OnClick Shop — Frontend

A modern, responsive e-commerce single-page application built with **React + TypeScript + Vite**, styled with **Tailwind CSS** and **DaisyUI**, powered by a **Laravel REST API**.

---

## ✨ Features

- 🏠 **Landing page** — hero section, shop, deals, new arrivals, and contact
- 🛍️ **Shop** — browse all products with category filter, sort, search, and pagination
- 🔥 **Deals** — discounted products with badge overlays
- 🛒 **Cart** — view items, remove items, live order summary, and checkout flow
- 💳 **Payment UI** — Visa / Mastercard / PayPal / Amex card form with live preview
- 👤 **Profile** — view your account info and avatar
- ⚙️ **Settings** — upload a profile photo, manage notification preferences
- 🔐 **Auth** — login and register with JWT token storage
- 📱 **Responsive** — mobile-first layout across all pages

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS 3 + DaisyUI 5 |
| HTTP client | Axios |
| Routing | React Router DOM 7 |
| Animation | Lottie (dotlottie-react) |
| State | React Context API |
| Backend | Laravel (separate repo) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/montassarbf/onClickShop.git
cd onClickShop/ecommerce-front

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and fill in VITE_API_URL (see below)

# 4. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables

Create a `.env` file in `ecommerce-front/` based on `.env.example`:

```env
# Base URL of the Laravel API — no trailing slash
VITE_API_URL=https://onclickshop.onrender.com/api
```

> **Local development:** set `VITE_API_URL=http://127.0.0.1:8000/api` if running the backend locally.

All variables must be prefixed with `VITE_` to be exposed to the browser by Vite.

---

## 📁 Folder Structure

```
ecommerce-front/src/
│
├── api/
│   └── apiClient.ts          # Axios instance — reads VITE_API_URL from .env
│
├── components/               # Reusable UI components
│   ├── AlertModal.tsx        # "Please log in" modal (Shop & Deals)
│   ├── Animation.tsx         # Lottie hero animation
│   ├── ContactSection.tsx    # Quick-contact form on the landing page
│   ├── Footer.tsx            # Site footer
│   ├── Layout.tsx            # Root layout: Navbar + <Outlet />
│   ├── LoadingSpinner.tsx    # Shared loading spinner
│   ├── Navbar.tsx            # Fixed top navigation bar
│   ├── NewArrivals.tsx       # "New Arrivals" landing section
│   ├── Pagination.tsx        # Page number controls
│   ├── ProductCard.tsx       # Shared product card (Shop & Deals)
│   └── ProtectedRoute.tsx    # Redirects guests to /login
│
├── context/
│   ├── CartContext.tsx        # Global cart state (add, remove, clear)
│   └── ProfileContext.tsx     # Global profile image state + fetch
│
├── hooks/
│   ├── useAddToCart.ts        # Auth-guarded add-to-cart logic
│   └── useProducts.ts         # Fetch products + categories with caching
│
├── pages/                     # Route-level page components
│   ├── Cart.tsx
│   ├── Contact.tsx
│   ├── Deals.tsx
│   ├── Home.tsx
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Profile.tsx
│   ├── Register.tsx
│   ├── Settings.tsx
│   └── Shop.tsx
│
├── types/
│   └── index.ts               # Shared TypeScript interfaces
│
├── constants.ts               # App-wide constants (cache keys, defaults)
├── App.tsx                    # Route definitions
├── index.css                  # Global styles
└── main.tsx                   # React entry point
```

---

## 🌐 API Integration

All requests go through `src/api/apiClient.ts`:

- **Base URL** — loaded from `VITE_API_URL` (never hardcoded)
- **Auth** — the JWT token is automatically attached via an Axios request interceptor
- **Caching** — products, categories, cart, and profile image are cached in `localStorage` so the UI loads instantly on revisit

### Key Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/login` | Login and receive a token |
| `POST` | `/register` | Create an account |
| `GET` | `/me` | Get the logged-in user's profile |
| `GET` | `/products` | Fetch all products |
| `GET` | `/categories` | Fetch all categories |
| `GET` | `/cart` | Fetch the user's cart items |
| `POST` | `/cart` | Add an item to the cart |
| `DELETE` | `/cart/:id` | Remove a cart item |
| `POST` | `/orders` | Place an order |
| `POST` | `/user/profile-image` | Upload a profile photo |

---

## ☁️ Deployment (Vercel)

The frontend is deployment-ready for [Vercel](https://vercel.com):

1. Push `ecommerce-front/` to a GitHub repo (or use the monorepo root)
2. In Vercel: set **Root Directory** to `ecommerce-front`
3. Add the environment variable:
   ```
   VITE_API_URL = https://onclickshop.onrender.com/api
   ```
4. Vercel auto-detects Vite and builds with `npm run build`

The `vercel.json` at the project root already includes the SPA rewrite rule:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

---

## 🛠️ Available Scripts

```bash
npm run dev      # Start dev server (hot reload)
npm run build    # Type-check + production build
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push and open a Pull Request

---

## 👨‍💻 Author

**Montassar Ben Fraj**

---

## 📄 License

This project is for educational purposes.
