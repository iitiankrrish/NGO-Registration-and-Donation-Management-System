import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX, FiHeart, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <span className="logo-icon">🏛️</span>
          <span className="logo-text">NSS IITR</span>
        </Link>

        <button className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={closeMenu}>
                Dashboard
              </Link>
              <Link to="/donate" className="nav-link donate-link" onClick={closeMenu}>
                <FiHeart /> Donate
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>
                  <FiSettings /> Admin
                </Link>
              )}
              <div className="nav-user">
                <span className="user-greeting">
                  <FiUser /> {user?.name}
                </span>
                <button className="nav-btn logout-btn" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/" className="nav-btn login-btn" onClick={closeMenu}>
                Login / Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
