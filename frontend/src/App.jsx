import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Donate from './pages/Donate'
import AdminPanel from './pages/AdminPanel'
import SuperadminPanel from './pages/SuperadminPanel'
import ProtectedRoute from './components/ProtectedRoute'
import Auth from './pages/Auth'
import { useAuth } from './context/AuthContext'

function AuthRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="loading-spinner large"></div></div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<AuthRoute><Auth /></AuthRoute>} />
          <Route path="/login" element={<AuthRoute><Auth /></AuthRoute>} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/donate" 
            element={
              <ProtectedRoute>
                <Donate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute superadminOnly={true}>
                <SuperadminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
