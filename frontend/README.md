# NSS IITR - Registration & Donation Portal

Frontend application for the NSS Registration and Donation Management System.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| HTTP | Axios |
| Charts | Recharts |
| Styling | Custom CSS |

## Features

- Single auth page (login/register with role selection)
- User dashboard with donation history
- Donation flow with sandbox payment simulation
- Admin panel with statistics, user management, CSV export

## Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Auth.jsx
│   ├── Dashboard.jsx
│   ├── Donate.jsx
│   └── AdminPanel.jsx
├── services/
│   └── api.js
├── styles/
│   └── index.css
├── App.jsx
└── main.jsx
```

## Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Auth | Public |
| `/dashboard` | Dashboard | Authenticated |
| `/donate` | Donate | Authenticated |
| `/admin` | Admin Panel | Admin only |

## API Endpoints

**Auth:** `/auth/signup`, `/auth/signin`, `/auth/logout`, `/auth/me`

**Donations:** `/finance/create-order`, `/finance/update-status`, `/finance/my-donations`

**Admin:** `/admin-portal/stats`, `/admin-portal/users`, `/admin-portal/export`, `/admin-portal/insights`, `/admin-portal/all-donations`

## Theme

- Primary: Navy Blue `#002366`
- Accent: Gold `#C5A065`
- Status: Success `#2E7D32`, Pending `#F57C00`, Failed `#D32F2F`
- Fonts: Inter, Roboto Slab
