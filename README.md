# The Lavish Restaurant – Digital Online Menu

## 🍽️ Project Overview
A complete, production-ready digital restaurant menu website for **THE LAVISH RESTAURANT**.

---

## 🗂️ Folder Structure
```
Lavish Online Menu Card/
├── client/              ← React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      ← Full landing page (hero, about, featured, reviews, contact)
│   │   │   ├── MenuPage.jsx      ← Digital menu with search, filters, categories, item modals
│   │   │   ├── AdminLogin.jsx    ← Secure admin login page
│   │   │   └── AdminDashboard.jsx← Full admin panel (menu, categories, restaurant info, QR, security)
│   │   ├── context/
│   │   │   └── AuthContext.jsx   ← JWT auth state management
│   │   ├── services/
│   │   │   └── api.js            ← All API calls
│   │   ├── App.jsx               ← Router setup
│   │   ├── main.jsx
│   │   └── index.css             ← Tailwind + custom luxury styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/              ← Node.js + Express backend
│   ├── config/
│   │   ├── db.js                 ← SQLite database setup (Sequelize ORM)
│   │   └── defaultData.js        ← All 70+ menu items seed data
│   ├── models/
│   │   ├── Category.js
│   │   ├── MenuItem.js
│   │   ├── RestaurantInfo.js
│   │   └── User.js               ← Admin user with bcrypt password hashing
│   ├── controllers/
│   │   ├── authController.js     ← Login, verify, change password
│   │   ├── menuController.js     ← CRUD + toggle availability/special
│   │   ├── categoryController.js ← CRUD categories
│   │   ├── restaurantController.js← Info + dashboard stats
│   │   └── qrController.js       ← QR code generation
│   ├── middleware/
│   │   ├── auth.js               ← JWT middleware
│   │   └── upload.js             ← Multer file upload
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── restaurantRoutes.js
│   │   └── qrRoutes.js
│   ├── data/                     ← SQLite database file (auto-created)
│   ├── uploads/                  ← Uploaded food images (auto-created)
│   ├── index.js                  ← Express server entry point
│   ├── .env                      ← Environment variables
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+ installed
- npm v8+

### Step 1 — Install Dependencies
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### Step 2 — Set Up Environment
The `.env` file is already configured in `server/.env`:
```env
PORT=5000
JWT_SECRET=the_lavish_restaurant_secret_key_2026_luxury
ADMIN_USERNAME=admin
ADMIN_PASSWORD=lavish@admin123
CLIENT_URL=http://localhost:5173
```

### Step 3 — Start the Backend
```bash
cd server
node index.js
```
The server starts at **http://localhost:5000**  
Database and seed data are created automatically on first run.

### Step 4 — Start the Frontend
```bash
cd client
npm run dev
```
The website opens at **http://localhost:5173**

---

## 🔐 Admin Access
| Field    | Value             |
|----------|-------------------|
| URL      | http://localhost:5173/admin |
| Username | `admin`           |
| Password | `lavish@admin123` |

> **Change your password** immediately after first login via Admin → Security tab.

---

## 🌐 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage (Hero, About, Featured, Reviews, Contact, Footer) |
| `/menu` | Full Digital Menu with search, filters, category tabs |
| `/admin/login` | Admin login page |
| `/admin` | Admin Dashboard (protected) |

---

## ⚡ Features

### Public Website
- 🏠 Luxury homepage with hero section, biryani image, stats
- 🍽️ Full digital menu (70+ dishes) with search & filter
- 📂 Category tabs: Biryani, Kebabs, Curries, Starters, Soups, Breads
- 🔍 Real-time search by dish name
- 🌿 Veg / Non-Veg / Egg diet filter
- 🔥 Spice level indicators
- ⭐ Chef's Special & Popular badges
- 📋 Item detail popup with order on WhatsApp button
- 📱 Fully mobile-first (designed for QR code scanning)
- ⬆️ Back to Top floating button
- 💬 WhatsApp floating button
- ⭐ Customer reviews section
- 📍 Location & hours section

### Admin Dashboard
- 📊 Dashboard stats (total items, categories, veg/non-veg count, etc.)
- ➕ Add new dishes with image upload or URL
- ✏️ Edit dish name, price, description, category, dietary type
- 🗑️ Delete dishes
- 👁️ Toggle availability (show/hide on public menu)
- ⭐ Toggle Chef's Special badge
- 📂 Create / edit / delete categories
- 🏪 Edit restaurant info (name, tagline, phone, address, hours, social links)
- 📱 Generate & download QR codes (by table number or main menu)
- 🔑 Change admin password

### QR Code
- Generates QR code linking to `/menu` page
- Optional: per-table QR codes
- Downloadable as PNG for printing
- No customer login required — scan and browse instantly

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 6 |
| Styling | Tailwind CSS 3 + Custom CSS |
| Routing | React Router DOM v6 |
| Backend | Node.js + Express |
| Database | SQLite (via Sequelize ORM) |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| QR Code | qrcode npm package |

---

## 📱 QR Code Usage
1. Go to Admin → QR Code tab
2. Click "Generate QR Code"
3. Download the PNG
4. Print it on restaurant tables
5. Customers scan → instantly see the menu (no login required)

---

## 🔄 Updating Menu
All changes made in the Admin Dashboard are saved to the SQLite database and reflect **immediately** on the public menu page. No server restart required.

---

## 📦 Build for Production
```bash
# Build client
cd client
npm run build

# The dist/ folder can be deployed to any static host (Netlify, Vercel, etc.)
# The server must be running for API calls to work
```

---

## 🌍 Deployment Notes
- Deploy `server/` on a Node.js host (Railway, Render, VPS, etc.)
- Deploy `client/dist/` on Netlify / Vercel / any static host
- Update `VITE_API_URL` env variable and the proxy config in `vite.config.js` for production API URL
- For production, use PostgreSQL instead of SQLite for better scalability
