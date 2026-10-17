# 🍕 PizzaHub — Full-Stack Pizza Delivery Web Application

> **Advanced Web Development & Designing Project**  
> Developed as a full-stack, responsive, production-ready pizza delivery application featuring a React + Vite frontend, Express.js REST API backend, and MongoDB database with JWT authentication and role-based admin controls.

---

## 🌟 Key Features

### 👤 Customer Experience
- **Interactive Menu & Categories:** Filter pizzas by category (*Classic*, *Cheese Lovers*, *Vegetarian*, *Spicy*, *Premium*), live search by name or ingredients, and sorting by rating and price.
- **Dynamic Cart Management:** Add items, modify quantities, delete items, real-time subtotal calculation, and persistent storage via `localStorage`.
- **Server-Secured Checkout:** Delivery address form with validation, cash on delivery payment support, and server-side price recalculation to prevent price tampering.
- **Live Order Progress Tracker:** Real-time visual progress stepper (`Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`) with estimated 30–40 min delivery time.
- **Customer Dashboard:** View past order history with item summaries, one-click **Reorder** button, and profile update functionality.
- **Responsive UI/UX:** Crafted with a custom CSS3 design system, rich typography (*Poppins* and *Inter*), micro-animations, and mobile-friendly drawer navigation.

### 🛡️ Admin Portal (`/admin`)
- **Operations Dashboard:** Live KPI statistics showing total revenue, order count, registered customers, and menu items.
- **Pizza Menu Management (CRUD):** Add new pizzas with custom images, tags (*Veg*, *Spicy*, *Popular*), edit prices or descriptions, delete items, and instantly toggle stock availability (`Available` vs `Sold Out`).
- **Live Order Dispatch:** Filter orders by status (*Pending*, *Confirmed*, *Preparing*, *Out for Delivery*, *Delivered*, *Cancelled*), search by customer or order number, and update dispatch status directly with instant updates.
- **Customer Directory:** View registered customers, contact details, and account creation timestamps.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite 5, React Router v6, Axios, Lucide React, React Hot Toast |
| **Styling** | Vanilla CSS3 Design System (CSS Custom Properties, Flexbox, CSS Grid) |
| **Backend** | Node.js, Express.js (REST API Architecture) |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt password hashing (12 rounds) |
| **Security & Utilities** | Express Rate Limit, Express Validator, Morgan Logger, CORS |

---

## 📁 Project Structure

```text
Pizza delivery/
├── client/                     # Frontend React + Vite Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Footer/         # Footer with quick links & hours
│   │   │   ├── Navbar/         # Responsive navbar with badge & avatar
│   │   │   ├── PizzaCard/      # Pizza card with badges & add-to-cart
│   │   │   └── ProtectedRoute.jsx # Auth & admin route guard
│   │   ├── context/            # Global React Contexts
│   │   │   ├── AuthContext.jsx # JWT session, login, register, logout
│   │   │   └── CartContext.jsx # Cart items, persistence, subtotals
│   │   ├── layouts/            # Page layouts
│   │   │   └── MainLayout.jsx  # Main storefront layout with Navbar & Footer
│   │   ├── pages/              # View pages
│   │   │   ├── About/          # Brand story, artisanal values
│   │   │   ├── Admin/          # Admin portal (Dashboard, Pizzas, Orders, Users)
│   │   │   ├── Auth/           # Login and Register split-panel pages
│   │   │   ├── Cart/           # Cart breakdown, quantity controls
│   │   │   ├── Checkout/       # Delivery address form & summary
│   │   │   ├── Contact/        # Contact form, direct hotline & FAQs
│   │   │   ├── Dashboard/      # Customer order history & profile
│   │   │   ├── Home/           # Hero, featured pizzas, testimonials
│   │   │   ├── Menu/           # Pizza catalog with filters & sorting
│   │   │   ├── NotFound/       # Playful 404 page
│   │   │   └── OrderSuccess/   # Order confirmation & status stepper
│   │   ├── services/           # Axios API service layer
│   │   │   └── api.js          # REST API endpoints & interceptors
│   │   ├── utils/              # Formatting helpers & constants
│   │   │   └── helpers.js      # formatPrice (PKR), formatDate, status colors
│   │   ├── App.jsx             # React Router v6 configuration
│   │   ├── index.css           # Global design system & tokens
│   │   └── main.jsx            # React root & providers
│   ├── index.html              # HTML5 entry with Google Fonts
│   ├── package.json            # Client dependencies
│   └── vite.config.js          # Vite config with /api proxy
│
├── server/                     # Backend Node.js + Express REST API
│   ├── config/
│   │   └── db.js               # Mongoose MongoDB connection
│   ├── controllers/            # Request handlers
│   │   ├── authController.js   # Register, Login, Current User
│   │   ├── orderController.js  # Order placement, customer & admin orders
│   │   ├── pizzaController.js  # Public & Admin Pizza CRUD
│   │   └── userController.js   # Customer profile & admin dashboard stats
│   ├── middleware/             # Express middlewares
│   │   ├── auth.js             # JWT protect and adminOnly guards
│   │   └── errorHandler.js     # Centralized error handler
│   ├── models/                 # Mongoose schemas
│   │   ├── Order.js            # Order schema with auto-generated orderNumber
│   │   ├── Pizza.js            # Pizza schema with categories & tags
│   │   └── User.js             # User schema with bcrypt pre-save hash
│   ├── routes/                 # Express route definitions
│   │   ├── auth.js             # /api/auth routes
│   │   ├── orders.js           # /api/orders routes
│   │   ├── pizzas.js           # /api/pizzas routes
│   │   └── users.js            # /api/users routes
│   ├── scripts/                # Database automation scripts
│   │   ├── createAdmin.js      # Interactive CLI admin generator
│   │   └── seed.js             # 15+ pizzas & default demo accounts
│   ├── .env                    # Environment configuration
│   ├── package.json            # Server dependencies
│   └── server.js               # Server entry point
│
└── README.md                   # Complete documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
1. **Node.js** (v18 or higher recommended)
2. **MongoDB** installed locally (`mongodb://localhost:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud connection string.

---

### Step 1: Backend Setup & Seeding

Open a terminal or PowerShell in the `server` directory:

```bash
# Navigate to server
cd server

# Install backend dependencies
npm install

# Seed database with 15+ pizzas and demo accounts
npm run seed

# Start Express server in development mode
npm run dev
# (or 'npm start' to run with node)
```

The server will start at: **`http://localhost:5000`**

#### 🔑 Built-In Demo Accounts (Created by `npm run seed`):
| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@pizzahub.com` | `Admin@12345` |
| **Customer** | `customer@pizzahub.com` | `Customer@12345` |

---

### Step 2: Frontend Setup & Running

Open a second terminal or PowerShell in the `client` directory:

```bash
# Navigate to client
cd client

# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser at: **`http://localhost:5173`**

The Vite frontend is pre-configured with an automated proxy for `/api` pointing to `http://localhost:5000`.

---

## 🔒 Security Implementations

1. **Server-Side Price Validation:**
   The frontend never dictates order item prices. During checkout (`POST /api/orders`), the backend fetches each pizza directly from the database by its `_id`, re-verifies availability, and calculates the exact subtotal and total server-side.
2. **JWT & Protected Routes:**
   Sensitive endpoints (`/api/orders`, `/api/users/me`, `/api/admin/*`) require a signed Bearer token verified by the `protect` middleware.
3. **Role-Based Access Control:**
   Admin routes require both a valid token and `req.user.role === 'admin'`. Non-admin customers attempting to hit `/api/admin/*` receive `403 Forbidden`.
4. **Bcrypt Password Hashing:**
   User passwords are automatically hashed with 12 salt rounds before persisting to MongoDB. Plaintext passwords are never stored or logged.

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new customer (`name`, `email`, `password`, `phone`) |
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT & user object |
| `GET` | `/api/auth/me` | Protected | Get current authenticated user profile |

### 🍕 Pizzas (`/api/pizzas`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/pizzas` | Public | Get all pizzas (supports `?category=`, `?search=`, `?sort=`) |
| `GET` | `/api/pizzas/:id` | Public | Get single pizza details |
| `POST` | `/api/pizzas` | Admin | Create a new pizza |
| `PUT` | `/api/pizzas/:id` | Admin | Update pizza details or stock availability |
| `DELETE` | `/api/pizzas/:id` | Admin | Remove pizza from catalog |

### 📦 Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Customer | Place order with address and items (recalculated server-side) |
| `GET` | `/api/orders/my-orders` | Customer | Get order history for the logged-in customer |
| `GET` | `/api/orders/:id` | Customer / Admin | Get order details by ID |
| `GET` | `/api/orders/admin/all` | Admin | Get all orders across the store (filter by `?status=`) |
| `PATCH` | `/api/orders/admin/:id/status`| Admin | Update order status (`Pending`, `Confirmed`, etc.) |

### 📊 Users & Dashboard (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/me` | Customer | View customer profile |
| `PATCH` | `/api/users/me` | Customer | Update name or phone |
| `GET` | `/api/users/admin/dashboard` | Admin | Retrieve operational KPIs (Revenue, Orders, Pizzas, Customers) |
| `GET` | `/api/users/admin/users` | Admin | List all registered customer accounts |

---

## 🎨 Design System & Visuals
- **Primary Color:** `#E63946` (Italian Tomato Red)
- **Accent Color:** `#F4A261` (Warm Crust Orange)
- **Background:** `#F8F8F8` (Off-White) with `#FFFFFF` cards and `#1D1D1D` dark accents
- **Typography:** *Poppins* for headings, *Inter* for body copy
- **Micro-interactions:** Hover lifts, badge pills, pulsing status tracker steps, sticky headers, and toast feedback.

---

## 🎓 Internship Task Requirements Fulfillment
- [x] Full-Stack architecture with **React.js (Vite)** + **Node.js (Express)** + **MongoDB (Mongoose)**
- [x] Complete RESTful APIs connecting React client to Express backend
- [x] JWT Authentication & Bcrypt password hashing
- [x] Lucide React icons & React Hot Toast alerts
- [x] Responsive layout across Mobile, Tablet, and Desktop
- [x] Seed script populated with 15+ pizzas & pre-configured demo credentials
- [x] Comprehensive documentation and local running guide
