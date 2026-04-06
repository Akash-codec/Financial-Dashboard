Hi there, I am Akash kumar I got selected forr both frontend and backend inter to do the projects as they were on the same topic i created this full stack app down bellow are the steps required to run this project and the api documentation.

Frontend Live link:- https://financial-dashboard-olive-seven.vercel.app/
Backend Live link:- https://financial-dashboard-3vwa.onrender.com

# Financial Dashboard

A full-stack Node.js (Express) and Vite React Application for managing personal finances.

## Run Instructions

### 1. Backend Setup
Navigate to the `backend` folder:
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
Navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```

## Admin Credentials

By default, an admin user is generated to test the Role-Based Access Control (RBAC) panel where you can elevate other users' permissions (such as assigning them `Analyst` or `Admin`).

### Default Admin User
- **Email:** `admin@findash.com`
- **Password:** `AdminPassword123!`

---
*Note: Users who register via the normal sign-up page are strictly confined to the `Viewer` role. Their role can only be updated from the "User Management" dashboard available only to an Admin.*

## API Documentation

The backend service runs on `http://localhost:8000`. All protected routes require a Bearer token in the `Authorization` header.

### 🔐 Authentication (`/api/auth`)
*   `POST /api/auth/register` - Register a new user (default role: `viewer`)
*   `POST /api/auth/login` - Authenticate and retrieve JWT payload

### 👥 User Management (`/api/users`)
*Requires `Admin` access level.*
*   `GET /api/users` - Retrieve a full list of registered users.
*   `PUT /api/users/:id/role` - Update specific user role (`viewer`, `analyst`, `admin`).

### 💸 Transactions (`/api/transactions`)
*Requires authentication.*
*   `GET /api/transactions` - Fetch all financial transactions.
*   `POST /api/transactions` - Create a new income/expense item.
*   `PUT /api/transactions/:id` - Update details for a specific item.
*   `DELETE /api/transactions/:id` - Remove a transaction from the ledger.

### 📊 Dashboard Analytics (`/api/dashboard`)
*Requires authentication.*
*   `GET /api/dashboard/summary` - Computes total income, expenses, and net balance aggregated amounts.
*   `GET /api/dashboard/recent` - Returns the latest 10 transactions.
*   `GET /api/dashboard/category-totals` - Returns dimensional data grouped absolutely by custom categories.
*   `GET /api/dashboard/monthly-trends` - Returns month-over-month aggregated volume data for Income and Expense timelines.
