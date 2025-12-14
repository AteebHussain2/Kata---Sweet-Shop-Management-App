# Sweet Shop Management System

A full-stack web application for managing a boutique sweet shop. This system enables users to browse and purchase sweets, while administrators can manage inventory, restock items, and oversee the product catalog. Built with modern web technologies and Test-Driven Development (TDD) practices.

## 🚀 Features

### User Features
- **User Authentication**: Secure registration and login using JWT and bcrypt.
- **Browse Sweets**: View a complete list of available sweets with real-time stock status.
- **Search & Filter**: Find sweets by name or category.
- **Purchase Items**: Buy sweets directly from the dashboard (decreases stock).
- **Responsive Design**: Beautiful, responsive UI built with Tailwind CSS and Shadcn ID.

### Admin Features
- **Role-Based Access Control**: Protected routes and UI elements for Admin users.
- **Inventory Management**:
    - **Add New Sweets**: Create new product listings with details (Name, Price, Category, Qty).
    - **Restock**: Update the quantity of existing items.
    - **Delete**: Remove items from the catalog.
    - **Stock Monitoring**: Visual indicators for low stock or sold-out items.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, PostCSS
- **State Management**: React Hooks
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: Helmet, CORS, Bcryptjs
- **Testing**: Jest, Supertest (TDD)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (running locally on port 27017)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sweet-shop-management
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

**Environment Configuration:**
Create a `.env` file in the `backend` directory:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/kata
JWT_SECRET=your_super_secret_key_change_in_production
FRONTEND_URL=http://localhost:5173
```

**Run the Server:**
```bash
# Development Mode
npm run dev

# Run Tests
npm test
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

**Environment Configuration:**
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:3000/api
```

**Run the Application:**
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## 🔑 Admin Setup
To create an admin user:
1. Register a new user via the Frontend (`/register`).
2. Update the user's role in the database to `'admin'`.
   
   *Alternatively, use the provided helper script:*
   ```bash
   # In backend directory, ensure you have a user named 'adminsuper' registered
   node promote_admin.js
   ```

## 📡 API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT

### Sweets
- `GET /api/sweets` - List all sweets
- `GET /api/sweets/search?name=...` - Search sweets
- `POST /api/sweets` - Add a sweet (Admin only)
- `PUT /api/sweets/:id` - Update a sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)
- `POST /api/sweets/:id/purchase` - Purchase a sweet (Decrements stock)
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only, Increments stock)

## 📂 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request handlers (Auth, Sweets)
│   │   ├── middleware/    # Auth & Admin verification
│   │   ├── models/        # Mongoose Models (User, Sweet)
│   │   ├── routes/        # API Routes
│   │   └── server.ts      # Entry point
│   └── tests/             # Jest tests
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI components (Shadcn)
    │   ├── pages/         # Page components (Login, Register, Dashboard)
    │   ├── types/         # TypeScript interfaces
    │   └── App.tsx        # Main router
    └── vite.config.ts     # Vite configuration
```


## 🚀 Deployment

### deployed on Vercel (Frontend & Backend) + MongoDB Atlas
Detailed deployment instructions are available in [deploy_workflow.md](./deploy_workflow.md).

**Quick Steps:**
1.  **Database**: Create a MongoDB Atlas cluster and get the URI.
2.  **Backend**: Deploy the `backend` folder to Vercel (add `MONGO_URI`, `JWT_SECRET`).
3.  **Frontend**: Deploy the `frontend` folder to Vercel (add `VITE_API_URL`).

## 📸 Screenshots

*(Add your screenshots here. The following were verified during development)*
-   **Admin Dashboard**: Shows product management and stock levels.
-   **User View**: Shows purchase options.
-   **Mobile View**: Fully responsive design.

## 🤖 My AI Usage

**Tools Used:**
-   **Google Gemini**: Primary AI coding assistant for code generation, refactoring, and debugging.

**How I Used Them:**
-   **Boilerplate Generation**: Used Gemini to generate the initial Express server setup, Mongoose schemas, and React component structures (Layout, Navbar).
-   **Refactoring**: Leveraged AI to refactor the monolithic `Dashboard.tsx` into smaller, modular components (`SweetCard`, `SweetGrid`) and to implement the "Glassmorphism" design system.
-   **Troubleshooting**: Used Gemini to diagnose and fix TypeScript errors in `connectDB.ts` and resolve `npm install` issues on Windows.
-   **Deployment Strategy**: Consulted AI to adapt the Express backend for Vercel Serverless functions (creating `vercel.json` and `api/index.ts`).

**Reflection:**
AI significantly accelerated the development process, particularly in handling repetitive boilerplate code and configuring complex CSS frameworks (Tailwind/Shadcn). It allowed me to focus more on the business logic (RBAC, stock management) rather than fighting with syntax. However, I learned that manual verification is crucial, especially for infrastructure usage (DB connections) and strictly typing external libraries.

---

## 🛡️ License
This project is part of a coding kata and is available for educational purposes.
