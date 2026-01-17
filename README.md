# NGO Registration and Donation Management System

A full-stack web application for managing NGO member registration and donations.

## Features

- User registration and login (supporter, admin, superadmin roles)
- Admin accounts require superadmin approval before login
- Dashboard with donation history
- Donate page with sandbox payment simulation
- Admin panel with statistics, charts, member list, donation list, CSV export
- Superadmin panel for approving admin registrations
- Filtering by donation status
- Export donor totals as CSV
- Floating action buttons (Home, Donate, Logout)

## Tech Stack

- Frontend: React 18, Vite, React Router, Axios, Recharts
- Backend: Node.js, Express, Mongoose
- Database: MongoDB

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Installation

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=5000
CONNECTION_URI=mongodb://localhost:27017/ngo_portal
SECRET_KEY=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
SUPERADMIN_EMAIL=superadmin@example.com
SUPERADMIN_PASSWORD=SuperAdmin123!
```

Start backend:

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

## Default Superadmin Credentials

```
Email:    superadmin@example.com
Password: SuperAdmin123!
```

Use these credentials to log in as superadmin and approve admin accounts.

## Project Structure

```
backend/
  main.js
  src/
    config/database.js
    endpoints/
      authRoutes.js
      adminRoutes.js
      payRoutes.js
    logic/
      authManager.js
      adminManager.js
      payManager.js
    protection/gatekeeper.js
    structures/
      Member.js
      Donation.js
      AuditLog.js

frontend/
  src/
    App.jsx
    main.jsx
    components/
      Navbar.jsx
      ProtectedRoute.jsx
    context/AuthContext.jsx
    pages/
      Auth.jsx
      Dashboard.jsx
      Donate.jsx
      AdminPanel.jsx
      SuperadminPanel.jsx
    services/api.js
    styles/index.css
```

## API Endpoints

### Auth

- POST /auth/signup - Register
- POST /auth/signin - Login
- POST /auth/logout - Logout
- GET /auth/me - Get profile

### Finance

- POST /finance/create-order - Create donation order
- POST /finance/update-status - Update payment status
- GET /finance/my-donations - User's donations

### Admin

- GET /admin-portal/stats - Dashboard stats
- GET /admin-portal/users - List supporters
- GET /admin-portal/all-donations - All donations
- GET /admin-portal/insights - Daily donation insights
- GET /admin-portal/export - Export members CSV
- GET /admin-portal/export-donations - Export donor totals CSV
- GET /admin-portal/pending-admins - Pending admin approvals (superadmin)
- POST /admin-portal/approve-admin - Approve admin (superadmin)

## Frontend Routes

- / - Auth page (login/register)
- /dashboard - User dashboard
- /donate - Donation page
- /admin - Admin panel
- /superadmin - Superadmin panel

## Project Report

See `docs/PROJECT_REPORT.txt` for detailed system architecture, database schema, flow diagrams, and design decisions.

## License

MIT


