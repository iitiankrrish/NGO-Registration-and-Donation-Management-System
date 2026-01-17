import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isSuperadmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleHomeClick = () => {
    if (isSuperadmin) {
      navigate('/superadmin');
    } else if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">🏛️</span>
            <span className="logo-text">NGO Portal</span>
          </Link>
          <div className="nav-right">
            {isAuthenticated ? (
              <span className="user-greeting">{user?.name}</span>
            ) : (
              <Link to="/login" className="nav-link">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Floating action buttons: only show when authenticated */}
      {isAuthenticated && (
        <div className="floating-actions">
          <button className="fab" onClick={handleHomeClick}>Home</button>
          {!isSuperadmin && (
            <button className="fab" onClick={() => navigate('/donate')}>Donate</button>
          )}
          <button className="fab" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </>
  );
};

export default Navbar;
