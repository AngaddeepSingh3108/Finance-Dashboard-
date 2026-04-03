# 💰 FinDash — Finance Dashboard Portal

A modern, role-based financial management dashboard built with **React**, **Node.js**, **Express**, and **MongoDB**. FinDash allows organizations to track income, expenses, and financial activity across multiple user roles with strict access control enforced at both the API and UI level.

🌐 **Live Demo**: [findashproject.vercel.app](https://findashproject.vercel.app)  
🔧 **Backend API**: [finance-dashboard-399e.onrender.com](https://finance-dashboard-399e.onrender.com)

---

## ✨ Features

### 📊 Overview Dashboard
- Live totals for **Total Income**, **Total Expenses**, and **Net Balance**
- **Category Breakdown Chart** — interactive bar chart powered by Chart.js showing spending by category
- **Recent Activity Feed** — last 5 transactions with date and amount at a glance
- All data is **role-scoped**: Admins see all users' data; Analysts and Viewers only see their own

### 💳 Transactions
- Full **paginated table** of financial records with date, category, type, and amount
- **Analyst** users can Edit their own records
- **Admin** users can Edit any record AND permanently Delete records with a confirmation prompt
- Instant UI refresh after any Create, Update, or Delete operation

### 👥 Users (Admin Only)
- Secure admin-only panel listing all system users
- Displays each user's Name, Email, and Role with a styled badge
- Completely hidden from the sidebar for non-Admin roles

### 📄 Reports (Admin Only)
- Dedicated report generation module
- One-click annual report download (extensible to CSV/PDF export)
- Only accessible by Admin users

---

## 🔐 Role-Based Access Control (RBAC)

FinDash enforces a strict 3-tier permission system, applied at both the **API middleware** level and the **React UI** level.

| Feature               | 👁️ Viewer | 📈 Analyst | 🛡️ Admin |
|-----------------------|-----------|-----------|---------|
| View Overview         | ✅        | ✅        | ✅      |
| View Transactions     | ❌        | ✅ (own)  | ✅ (all)|
| Add New Record        | ❌        | ✅        | ✅      |
| Edit Record           | ❌        | ✅ (own)  | ✅ (all)|
| Delete Record         | ❌        | ❌        | ✅      |
| View Users Panel      | ❌        | ❌        | ✅      |
| Access Reports        | ❌        | ❌        | ✅      |

---

## 🚀 Getting Started (Running Locally)

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/AngaddeepSingh3108/Finance-Dashboard-.git
cd Finance-Dashboard-
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/finance_dashboard
```

Seed the database with the 3 test users:

```bash
node seed.js
```

Start the API server:

```bash
node server.js
```

The backend will run on `http://localhost:5001`

### 3. Setup the Frontend

```bash
cd frontend
npm install
npm run dev
```

The React app will run on `http://localhost:5173`

> **Note:** To run locally, make sure `Login.jsx`, `Dashboard.jsx`, `Transactions.jsx`, and `Users.jsx` all have `BASE_URL` pointing to `http://localhost:5001/api`.

---

## 🔑 Login Credentials

FinDash uses email-based authentication. Simply enter one of the emails below on the login screen — no password required (mock auth via `x-user-id` header).

| Role    | Email                    | Access Level                          |
|---------|--------------------------|---------------------------------------|
| 🛡️ Admin   | `admin@finance.com`   | Full access — all users, all records  |
| 📈 Analyst | `analyst@finance.com` | Own records — can create & edit       |
| 👁️ Viewer  | `viewer@finance.com`  | Read-only — Overview dashboard only   |

> These users are pre-seeded into the database via `backend/seed.js`.

---

## 🗂️ Project Structure

```
Finance_Dashboard/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── userController.js      # User CRUD + mock login
│   │   ├── recordController.js    # Financial record CRUD
│   │   └── summaryController.js   # Aggregated dashboard data
│   ├── middleware/
│   │   ├── authMiddleware.js      # protect() + authorize() RBAC
│   │   ├── errorMiddleware.js     # Global error handler
│   │   └── validate.js            # express-validator integration
│   ├── models/
│   │   ├── User.js                # User schema (name, email, role)
│   │   └── Record.js              # Financial record schema
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── recordRoutes.js
│   │   └── summaryRoutes.js
│   ├── seed.js                    # Database seeder for test users
│   └── server.js                  # Express app entry point
│
└── frontend/
    └── src/
        ├── App.jsx                # Auth state router
        ├── index.css              # Global dark theme styles
        └── components/
            ├── Login.jsx          # Email-based login screen
            ├── Login.css
            ├── Dashboard.jsx      # Main layout + sidebar router
            ├── Dashboard.css
            ├── Transactions.jsx   # Full CRUD transaction table
            ├── Users.jsx          # Admin-only user list
            └── Reports.jsx        # Report generation panel
```

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Chart.js, Axios     |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB, Mongoose                   |
| Auth       | Mock header-based (`x-user-id`)     |
| Validation | express-validator                   |
| Hosting    | Vercel (frontend) + Render (backend)|
| DB Hosting | MongoDB Atlas                       |

---

## 📡 API Endpoints

### Users
| Method | Endpoint          | Access    | Description           |
|--------|-------------------|-----------|-----------------------|
| GET    | `/api/users`      | Admin     | List all users        |
| POST   | `/api/users`      | Public    | Register a new user   |
| POST   | `/api/users/login`| Public    | Login (returns user)  |

### Records
| Method | Endpoint           | Access           | Description              |
|--------|--------------------|------------------|--------------------------|
| GET    | `/api/records`     | All roles        | Get records (role-scoped)|
| POST   | `/api/records`     | Analyst, Admin   | Create new record        |
| PUT    | `/api/records/:id` | Analyst, Admin   | Update a record          |
| DELETE | `/api/records/:id` | Admin only       | Delete a record          |

### Summary
| Method | Endpoint       | Access   | Description                    |
|--------|----------------|----------|--------------------------------|
| GET    | `/api/summary` | All roles| Get aggregated dashboard data  |

---

## 🚢 Deployment

### Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Set **Start Command** to `node server.js`
5. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `PORT` = `5001`

### Frontend (Vercel)
1. Import your GitHub repository on [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Vercel auto-detects Vite — click Deploy!

### Database (MongoDB Atlas)
1. Create a free M0 cluster on [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user with a strong password
3. Set Network Access to `0.0.0.0/0` to allow Render connections
4. Copy the connection string into Render's environment variables

---

## 👤 Author

**Angaddeep Singh**  
GitHub: [@AngaddeepSingh3108](https://github.com/AngaddeepSingh3108)
