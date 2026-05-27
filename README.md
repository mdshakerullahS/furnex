# 🛋️ Furniro – Full Stack E‑commerce Application

Furniro is a **full‑stack e‑commerce web application** built with modern web technologies. It features robust user authentication, product browsing with advanced filtering, real-time cart and order management, and a fully functional admin dashboard with Role-Based Access Control (RBAC).

This project demonstrates a complete real‑world e‑commerce workflow using **Next.js App Router** and **Node.js + Express**.

---

## 🚀 Features

### 👤 User Features

- **Authentication & Security:** Register / Login with secure JWT-based sessions and email verification via Brevo.
- **Product Discovery:** Browse products with advanced filtering and search capabilities.
- **Shopping Cart:** Dynamic cart management (add, update, remove items) powered by Zustand.
- **Order Tracking:** Comprehensive order history where customers can view and track their past purchases.
- **Responsive UI:** Fully optimized for mobile, tablet, and desktop views using Tailwind CSS and shadcn/ui.

### 🛠️ Admin Features

- **Live Admin Dashboard:** A fully integrated management suite operating on real-time database data.
- **Role-Based Access Control (RBAC):** Secure authorization layers ensuring only authorized administrators can access management tools.
- **Product Management:** Complete CRUD operations (Create, Read, Update, Delete) for products.
- **Order Management:** Track, update, and manage customer orders seamlessly.
- **Media Storage:** Integrated image upload pipeline utilizing Cloudinary.

---

## 🧰 Tech Stack

### Frontend

- **Next.js** (App Router)
- **Tailwind CSS**
- **shadcn/ui**
- **Zustand** (state management)

### Backend

- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose)
- **JWT Authentication**
- **Brevo** (email verification)
- **Cloudinary** (image uploads)

---

## 🔐 Environment Variables

### Frontend (`.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend (`.env`)

```env
NODE_ENV=
PORT=8000
MONGODB_URI=
JWT_SECRET=

FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

BREVO_API_KEY=
EMAIL_USER=
```

---

## ▶️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mdshakerullahS/Furniro.git
cd furniro
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend will run on:

```
http://localhost:8000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:3000
```

---

## 🔄 API Communication

The frontend communicates with the backend using REST APIs configured via:

```env
NEXT_PUBLIC_API_URL
```

---

## 📸 Screenshots

- Homepage

  ![Homepage](Homepage.png)

- Product listing

  ![Product listing](Product_Listing.png)

- Cart page

  ![Cart page](Cart_Page.png)

- Admin dashboard <small>(Dummy)</small>

  ![Admin dashboard](Admin_Dashboard.png)

---

## 🧪 Authentication Flow

- JWT-based authentication
- Secure HTTP-only cookies
- Email verification after registration

---

## 🧑‍💻 Developer

**Md Shakerullah Sourov**
Full Stack Developer

- LinkedIn: [https://linkedin.com/in/mdshakerullah](https://linkedin.com/in/mdshakerullah)
- Email: [sourovmdshakerullah@gmail.com](mailto:sourovmdshakerullah@gmail.com)

---

## 📌 Notes

- Payment flow is currently **dummy / non‑integrated**
- Project is intended for learning, portfolio, and demonstration purposes

---

## 📄 License

This project is licensed under the **MIT License**.
See the `LICENSE` file for full details.

---

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

Happy Coding 🚀
