# 🛒 E-Commerce Website (Smartphones, PCs & Accessories)

## 📌 Description

This is a full-stack e-commerce web application specialized in selling **smartphones, computers, and accessories**.

The project is built using a modern architecture:

* **Frontend:** React.js (with React Router)
* **Backend:** Laravel (RESTful API)
* **Database:** MySQL

The application provides a smooth and responsive user experience with dynamic product browsing, authentication, and order management.

---

## 🚀 Features

### 👤 User Features

* 🔐 Authentication (Register / Login)
* 🛍️ Browse products by category
* 🔎 Search and filter products
* 🛒 Add to cart / Remove from cart
* 💳 Place orders
* 📦 View order history

### 🛠️ Admin Features

* ➕ Add / Edit / Delete products
* 📊 Manage stock and discounts
* 👥 Manage users
* 📦 Manage orders

---

## 🧱 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS / Tailwind (if used)

### Backend

* Laravel (API)
* RESTful architecture
* Laravel Controllers & Middleware

### Database

* MySQL

---

## 📁 Project Structure

```
project-root/
│
├── frontend/        # React application
│
└── backend/         # Laravel API
```

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

### 2️⃣ Backend Setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure your `.env` file (database):

```
DB_DATABASE=your_db
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations:

```bash
php artisan migrate
```

Start server:

```bash
php artisan serve
```

---

### 3️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

---

## 🔗 API Configuration

In React, set your backend URL:

```js
const API_URL = "http://127.0.0.1:8000/api";
```

---

## 🌐 Deployment

* Frontend: Netlify
* Backend: Railway / Render
* Database: MySQL (Railway or external)

---

## ⚠️ Common Issues

### CORS مشكلة

Make sure Laravel يسمح بالـ requests:

```php
'allowed_origins' => ['*'],
```

---

### Storage (Images)

```bash
php artisan storage:link
```

---

## 📸 Screenshots

(Add screenshots of your UI here)

---

## 📈 Future Improvements

* 💳 Online payment integration
* ⭐ Product reviews & ratings
* 📱 Mobile optimization
* 🔔 Notifications system

---

## 👨‍💻 Author

* Montassar Benfraj

---

## 📜 License

This project is open-source and free to use.
