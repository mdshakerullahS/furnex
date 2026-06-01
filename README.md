# Furniro — Full Stack E-commerce Application

> **Live Demo:** [https://furnex-one.vercel.app](https://furnex-one.vercel.app)

A full-stack e-commerce web application built with modern web technologies. Features secure JWT authentication with email verification, product browsing with advanced filtering, real-time cart and order management, and a fully functional admin dashboard with Role-Based Access Control (RBAC).

Built with Next.js App Router, Node.js + Express, MongoDB, and a custom RBAC authorization layer. Designed for learning, portfolio, and demonstration purposes.

---

## Tech Stack

| Layer            | Tool                                |
| ---------------- | ----------------------------------- |
| Frontend         | Next.js (App Router) + Tailwind CSS |
| UI Components    | shadcn/ui                           |
| State Management | Zustand                             |
| Backend          | Node.js + Express.js                |
| Database         | MongoDB (Mongoose)                  |
| Authentication   | JWT + HTTP-only cookies             |
| Email            | Brevo (email verification)          |
| Media Storage    | Cloudinary                          |

---

## Features

### User features

| Feature                  | What's included                                                               |
| ------------------------ | ----------------------------------------------------------------------------- |
| 👤 **Authentication**    | Register / Login with JWT sessions, HTTP-only cookies, and email verification |
| 🔍 **Product Discovery** | Browse products with advanced filtering and search                            |
| 🛒 **Shopping Cart**     | Add, update, and remove items — powered by Zustand                            |
| 📦 **Order Tracking**    | Full order history with status tracking for past purchases                    |
| 📱 **Responsive UI**     | Optimized for mobile, tablet, and desktop                                     |

### Admin features

| Feature                   | What's included                                                                |
| ------------------------- | ------------------------------------------------------------------------------ |
| 📊 **Live Dashboard**     | Real-time management suite operating directly on live database data            |
| 🔐 **RBAC**               | Role-based access control — only authorized admins can access management tools |
| 🗂️ **Product Management** | Full CRUD operations — create, read, update, delete products                   |
| 🚚 **Order Management**   | Track, update, and manage all customer orders                                  |
| 🖼️ **Media Storage**      | Image upload pipeline via Cloudinary                                           |

---

## Running Locally

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Cloudinary account
- Brevo account (for email verification)

### Install

```bash
git clone https://github.com/mdshakerullahS/Furniro.git
cd furniro
```

### Environment variables

**Frontend** — create `.env` in `/frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Backend** — create `.env` in `/backend`:

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

### Run

```bash
# Backend — http://localhost:8000
cd backend
npm install
npm run dev

# Frontend — http://localhost:3000
cd frontend
npm install
npm run dev
```

---

## How Authentication Works

```
Register / Login
       │
       ├─ 1. User submits credentials
       │      └─ Password hashed and stored in MongoDB
       │         JWT issued and stored in HTTP-only cookie
       │
       ├─ 2. Email Verification (Brevo)
       │      └─ Verification email sent on registration
       │         Account activated on confirmation
       │
       └─ 3. Protected Routes
              RBAC middleware checks role on every admin request
              Customers only access their own orders and cart
```

---

## Project Structure

```
furniro/
├── frontend/
│   └── src/
│       ├── app/                    # Next.js App Router pages
│       ├── components/             # Reusable UI components (shadcn/ui)
│       └── store/                  # Zustand state management (cart, auth)
│
└── backend/
    └── src/
        ├── controllers/            # Route handlers (auth, products, orders)
        ├── middleware/             # JWT verification + RBAC authorization
        ├── models/                 # Mongoose schemas (User, Product, Order)
        └── routes/                 # Express route definitions
```

---

## Notes

- Payment flow is currently **non-integrated** (dummy placeholder)
- Project is intended for **learning, portfolio, and demonstration** purposes

---

## Contact

**Md Shakerullah Sourov**

- GitHub: [@mdshakerullahS](https://github.com/mdshakerullahS)
- LinkedIn: [linkedin.com/in/mdshakerullah](https://linkedin.com/in/mdshakerullah)
- Email: sourovmdshakerullah@gmail.com

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for full details.
