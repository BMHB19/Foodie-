# FoodieHub – Online Food Ordering System (MERN Stack)

Full-Stack MERN (MongoDB / JSON Document Store, Express.js, React.js, Node.js) web application built for college mini-projects, portfolio showcases, and real-world food ordering workflows.

---

## 🚀 How to Open and Run in Visual Studio Code (VS Code)

### Step 1: Export from AI Studio to your Local Machine
You can transfer your codebase from Google AI Studio to your computer in two ways:
1. **Via GitHub (Recommended):**
   - Click the **"Export to GitHub"** button in the top header of AI Studio.
   - Choose your GitHub repository name and click Export.
   - Open your terminal on your local computer and run:
     ```bash
     git clone <your-github-repo-url>
     cd <repo-folder-name>
     code .
     ```
   *(Running `code .` automatically launches VS Code with this project loaded).*

2. **Via Download ZIP:**
   - Download the project files as a ZIP archive from the AI Studio menu.
   - Unzip the archive into a folder on your computer.
   - Open VS Code, select **File > Open Folder...**, and select the extracted project folder.

---

### Step 2: Connect MongoDB Database

1. Create a `.env` file in the root folder (copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `copy .env.example .env`)*

2. Add your MongoDB connection string in `.env`:
   - **Option 1: Local MongoDB (MongoDB Community Server / Compass)**
     ```env
     MONGODB_URI="mongodb://127.0.0.1:27017/foodiehub"
     JWT_SECRET="foodiehub_mern_jwt_secret"
     ```
   - **Option 2: Cloud MongoDB Atlas**
     ```env
     MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/foodiehub"
     JWT_SECRET="foodiehub_mern_jwt_secret"
     ```

   *(Note: When `MONGODB_URI` is configured, FoodieHub connects via **Mongoose** and automatically seeds the `users`, `foods`, and `orders` collections on first launch. If `MONGODB_URI` is left blank, it safely falls back to `data/db.json`.)*

---

### Step 3: Install Dependencies & Run in VS Code

Open the integrated terminal in VS Code (`Ctrl + ~` on Windows/Linux or `Cmd + ~` on macOS) and run:

```bash
npm install
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔑 Demo Account Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Customer (Harshith)** | `harshith@gmail.com` | `password123` | Browse menu, add to cart, apply promo codes, place orders, view receipts, and track live order status. |
| **Admin (Kitchen Manager)** | `admin@foodiehub.com` | `admin123` | View all customer orders, advance order status (`Pending` ➔ `Confirmed` ➔ `In Kitchen` ➔ `Out for Delivery` ➔ `Delivered`), add/edit/delete dishes, update prices, and reset demo data. |

*(You can also use the one-click **"⚡ Quick Demo Accounts"** buttons inside the Sign In modal to test both accounts instantly).*

---

## 🛠️ Technology Stack

- **Database:** MongoDB with Mongoose ODM (`User`, `Food`, `Order` models).
- **Backend:** Node.js, Express.js REST API, `bcryptjs` password encryption, and `jsonwebtoken` (JWT) authentication.
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React Icons.
- **Tooling:** Vite, TSX, ESLint/TypeScript compiler.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/foods` | Get all food items (supports `?category=`, `?search=`, `?veg=true`) |
| `GET` | `/api/foods/:id` | Get details of a single food item |
| `POST` | `/api/foods` | Add a new food item (Admin) |
| `PUT` | `/api/foods/:id` | Update food price, availability, or details |
| `DELETE` | `/api/foods/:id` | Remove a food item from the menu |
| `POST` | `/api/users/register` | Register a new user (with bcrypt hashed password) |
| `POST` | `/api/users/login` | Authenticate and issue JWT token |
| `GET` | `/api/users/me` | Fetch authenticated user profile |
| `POST` | `/api/orders` | Place a food order (calculates bill, GST, discount) |
| `GET` | `/api/orders` | Get user orders or all orders (for admin) |
| `PATCH` | `/api/orders/:id/status` | Advance live order delivery status |
| `POST` | `/api/seed` | Reset MongoDB collections to default dishes and sample orders |
| `GET` | `/api/health` | Health check, active database engine, and collection statistics |

---

## 📂 Project Directory Structure

```
FoodieHub/
├── backend/
│   ├── config/
│   │   └── db.ts             # Mongoose connection & auto-seeder
│   ├── data/
│   │   └── seedData.ts       # Default 14 menu items
│   └── models/
│       ├── User.ts           # Mongoose User schema
│       ├── Food.ts           # Mongoose Food schema
│       └── Order.ts          # Mongoose Order schema
├── src/
│   ├── assets/images/        # High-resolution food photography assets
│   ├── components/
│   │   ├── Navbar.tsx        # 3-Zone top navigation
│   │   ├── Footer.tsx        # Domain-authentic footer
│   │   ├── FoodCard.tsx      # Dish card with veg indicator, stepper & price
│   │   ├── FoodDetailModal.tsx # Nutritional preview and calorie facts
│   │   ├── CartDrawer.tsx    # Slide-over cart drawer with coupon applicator
│   │   ├── AuthModal.tsx     # Login/Register with 1-click demo switcher
│   │   └── ProjectVivaModal.tsx # FSD Mini-Project 11/11 Viva Evaluation Guide
│   ├── context/
│   │   ├── AuthContext.tsx   # User authentication state
│   │   └── CartContext.tsx   # Shopping cart state & coupon discounts
│   ├── pages/
│   │   ├── HomePage.tsx      # Landing hero, categories & chef specials
│   │   ├── MenuPage.tsx      # Searchable catalog with category & dietary filters
│   │   ├── CheckoutPage.tsx  # Address form, bill breakdown & payment selector
│   │   ├── OrdersPage.tsx    # Real-time 5-step visual delivery tracker & receipts
│   │   └── AdminDashboard.tsx# Kitchen dispatch pipeline & menu manager
│   ├── services/
│   │   └── api.ts            # Client REST API wrapper
│   ├── types/
│   │   └── index.ts          # Shared TypeScript models
│   ├── App.tsx               # Root application router
│   ├── index.css             # Tailwind CSS styles
│   └── main.tsx              # React DOM mounting
├── .env.example              # Environment variables template (MONGODB_URI, JWT_SECRET)
├── index.html                # HTML entry point with fonts
├── package.json              # Scripts & dependencies
├── server.ts                 # Full-stack Express server with Vite middleware
├── tsconfig.json             # TypeScript compiler settings
└── vite.config.ts            # Vite configuration
```

---

## 💡 Recommended VS Code Extensions

For the best development experience in VS Code, install:
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **Thunder Client** or **Postman** (for testing REST API endpoints directly inside VS Code)
