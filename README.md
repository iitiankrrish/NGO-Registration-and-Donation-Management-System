# 🏛️ NSS IITR - Registration & Donation Portal

Full-stack web application for member registration and donation management for the National Service Scheme (NSS) unit at IIT Roorkee.

## Tech Stack

### Frontend
| Component | Technology |
|-----------|------------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| HTTP | Axios |
| Charts | Recharts |
| Styling | Custom CSS |

### Backend
| Component | Technology |
|-----------|------------|
| Runtime | Node.js 20.x |
| Framework | Express 5.x |
| Database | MongoDB + Mongoose |
| Auth | JWT (HttpOnly Cookies) |
| Encryption | bcryptjs |

## Features

- **Auth** - Single page login/register with role selection (admin/supporter)
- **Dashboard** - User profile view and donation history
- **Donate** - Payment flow with sandbox simulation
- **Admin Panel** - Statistics, member management, CSV export, charts

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "PORT=5000" > .env
echo "MONGO_URI=your_mongodb_connection_string" >> .env
echo "JWT_SECRET=your_secret_key" >> .env

npm start
```
Runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

## Project Structure

```
├── backend/
│   ├── main.js                 # Entry point
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # MongoDB connection
│   │   ├── endpoints/
│   │   │   ├── authRoutes.js   # /api/auth/*
│   │   │   ├── payRoutes.js    # /api/pay/*
│   │   │   └── adminRoutes.js  # /api/admin/*
│   │   ├── logic/
│   │   │   ├── authManager.js
│   │   │   ├── payManager.js
│   │   │   └── adminManager.js
│   │   ├── protection/
│   │   │   └── gatekeeper.js   # JWT middleware
│   │   └── structures/
│   │       ├── Member.js
│   │       ├── Donation.js
│   │       └── AuditLog.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Donate.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json


```

## API Endpoints

### Auth Routes `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create new account |
| POST | `/login` | Login & get JWT |
| POST | `/logout` | Clear auth cookie |
| GET | `/verify` | Verify session |

### Payment Routes `/api/pay`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/initiate` | Create donation |
| POST | `/verify` | Verify payment |
| GET | `/history` | User donations |

### Admin Routes `/api/admin`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Dashboard stats |
| GET | `/members` | List all members |
| GET | `/donations` | All donations |
| PATCH | `/members/:id` | Update role |

## Frontend Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Auth | Public |
| `/dashboard` | Dashboard | Authenticated |
| `/donate` | Donate | Authenticated |
| `/admin` | Admin Panel | Admin only |

## Theme

| Element | Color |
|---------|-------|
| Primary | Navy Blue `#002366` |
| Accent | Gold `#C5A065` |
| Success | Green `#2E7D32` |
| Pending | Orange `#F57C00` |
| Failed | Red `#D32F2F` |

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```


