<div align="center">

# 🛒 OnClick Shop

**A full-stack e-commerce platform for smartphones, computers & accessories**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev)

</div>

---

## 📌 Overview

**OnClick Shop** is a modern full-stack e-commerce application with a clean React + TypeScript frontend and a robust Laravel REST API backend. It supports product browsing, cart management, order placement, user authentication, and profile management.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 **Authentication** | Register, login, JWT token-based auth |
| 🛍️ **Shop** | Browse all products with category filter, sort & search |
| 🔥 **Deals** | Discounted products with percentage badge overlay |
| 🛒 **Cart** | Add / remove items, real-time totals, localStorage cache |
| 💳 **Checkout** | Card form with live preview (Visa, Mastercard, PayPal, Amex) |
| 👤 **Profile** | View account info and avatar |
| ⚙️ **Settings** | Upload profile photo, manage notification preferences |
| 📱 **Responsive** | Mobile-first design across all pages |
| ⚡ **Performance** | Cache-first data loading — instant UI on revisit |

---

## 🧱 Tech Stack

### Frontend — `ecommerce-front/`
| Technology | Version | Role |
|---|---|---|
| React + TypeScript | 19 / 5.9 | UI framework |
| Vite | 7 | Build tool & dev server |
| Tailwind CSS | 3 | Utility-first styling |
| DaisyUI | 5 | Component library |
| Axios | 1.x | HTTP client |
| React Router DOM | 7 | Client-side routing |
| Lottie (dotlottie-react) | 0.17 | Hero animations |

### Backend — `ecommerce-back/`
| Technology | Role |
|---|---|
| Laravel 11 | REST API framework |
| MySQL | Relational database |
| Laravel Sanctum | API token authentication |
| Laravel Storage | Profile image uploads |

---

## 📁 Monorepo Structure

```
onClickShop/
│
├── ecommerce-front/          # React + TypeScript SPA
│   ├── src/
│   │   ├── api/              # Axios instance (env-based URL)
│   │   ├── components/       # Shared UI components
│   │   ├── context/          # Cart & Profile global state
│   │   ├── hooks/            # Custom hooks (useProducts, useAddToCart)
│   │   ├── pages/            # Route-level page components
│   │   ├── types/            # Shared TypeScript interfaces
│   │   └── constants.ts      # App-wide constants
│   ├── .env.example          # Environment variable template
│   └── README.md             # Frontend-specific docs
│
├── ecommerce-back/           # Laravel REST API
│   ├── app/
│   │   ├── Http/Controllers/ # API controllers
│   │   └── Models/           # Eloquent models
│   ├── routes/api.php        # API routes
│   ├── .env.example          # Backend environment template
│   └── README.md             # Backend-specific docs
│
└── README.md                 # ← You are here
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| PHP | 8.2+ |
| Composer | 2+ |
| MySQL | 8+ |

---

### 1. Clone the repository

```bash
git clone https://github.com/montassarbf/onClickShop.git
cd onClickShop
```

---

### 2. Backend Setup (Laravel)

```bash
cd ecommerce-back

# Install PHP dependencies
composer install

# Copy and configure environment
cp .env.example .env
php artisan key:generate
```

Edit `.env` with your database credentials:

```env
DB_DATABASE=onclickshop
DB_USERNAME=root
DB_PASSWORD=your_password
```

```bash
# Run database migrations
php artisan migrate

# Link storage for profile image uploads
php artisan storage:link

# Start the API server
php artisan serve
# → API available at http://127.0.0.1:8000/api
```

---

### 3. Frontend Setup (React)

```bash
cd ecommerce-front

# Install JS dependencies
npm install

# Copy and configure environment
cp .env.example .env
```

Edit `.env`:

```env
# For local development (backend running via php artisan serve)
VITE_API_URL=http://127.0.0.1:8000/api

# For production (deployed backend)
# VITE_API_URL=https://onclickshop.onrender.com/api
```

```bash
# Start the dev server
npm run dev
# → App available at http://localhost:5173
```

---

## 🔑 Environment Variables

### Frontend (`ecommerce-front/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the Laravel API | `https://onclickshop.onrender.com/api` |

> All Vite env variables must be prefixed with `VITE_` to be accessible in the browser.

### Backend (`ecommerce-back/.env`)

Refer to `ecommerce-back/.env.example` for the full list of required variables (DB, mail, Sanctum, storage, etc.).

---

## 🌐 Deployment

### Frontend — Vercel

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set **Root Directory** → `ecommerce-front`
3. Add environment variable: `VITE_API_URL=https://your-api.onrender.com/api`
4. Vercel auto-detects Vite and runs `npm run build`

The included `vercel.json` handles SPA client-side routing automatically.

### Backend — Render / Railway

1. Deploy `ecommerce-back/` as a **Web Service**
2. Set all required `.env` variables in the dashboard
3. Set the start command: `php artisan serve --host=0.0.0.0 --port=$PORT`

---

## 🛠️ Common Issues

### CORS errors
Ensure your backend `config/cors.php` allows the frontend origin:

```php
'allowed_origins' => ['https://your-frontend.vercel.app'],
```

Or during local development: `'allowed_origins' => ['*']`

### Profile images not showing
Run the storage symlink command after deployment:

```bash
php artisan storage:link
```

### API URL still pointing to localhost in production
Make sure `VITE_API_URL` is set in your Vercel/Render environment — the `.env` file is not committed to git.

---

## 🛣️ Roadmap

- [ ] Online payment integration (Stripe)
- [ ] Product reviews & star ratings
- [ ] Admin dashboard (product / order management)
- [ ] Email order confirmations
- [ ] Wishlist feature
- [ ] PWA support

---

## 👨‍💻 Author

**Montassar Ben Fraj**

---

## 📄 License

This project is open-source and available for educational purposes.
