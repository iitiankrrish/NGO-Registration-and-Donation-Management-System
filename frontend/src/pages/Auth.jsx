import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiLogIn, FiUserPlus, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [mode, setMode] = useState('login'); // login | signup
  const [formData, setFormData] = useState({
    fullName: '',
    officialEmail: '',
    passCode: '',
    confirmPassword: '',
    userRole: 'supporter',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await login({
        officialEmail: formData.officialEmail,
        passCode: formData.passCode,
      });
      if (response.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (formData.passCode !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.passCode.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signup({
        fullName: formData.fullName,
        officialEmail: formData.officialEmail,
        passCode: formData.passCode,
        userRole: formData.userRole,
      });
      setSuccess('Registration successful! Please login to continue.');
      setMode('login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🏛️</div>
            <h1>{mode === 'login' ? 'Sign In' : 'Register'}</h1>
            <p>NSS IITR Registration Portal</p>
          </div>

          <div className="tab-switcher">
            <button
              className={mode === 'login' ? 'tab active' : 'tab'}
              onClick={() => setMode('login')}
            >
              <FiLogIn /> Login
            </button>
            <button
              className={mode === 'signup' ? 'tab active' : 'tab'}
              onClick={() => setMode('signup')}
            >
              <FiUserPlus /> Register
            </button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <div className="form-group">
                <label htmlFor="fullName">
                  <FiUser /> Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="officialEmail">
                <FiMail /> Email Address
              </label>
              <input
                type="email"
                id="officialEmail"
                name="officialEmail"
                value={formData.officialEmail}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="passCode">
                <FiLock /> Password
              </label>
              <input
                type="password"
                id="passCode"
                name="passCode"
                value={formData.passCode}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {mode === 'signup' && (
              <>
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <FiLock /> Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="userRole">
                    <FiShield /> Account Role
                  </label>
                  <select
                    id="userRole"
                    name="userRole"
                    value={formData.userRole}
                    onChange={handleChange}
                  >
                    <option value="supporter">Supporter</option>
                    <option value="admin">Admin</option>
                  </select>
                  <p className="helper-text">Admins can access admin dashboard; supporters can donate.</p>
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? (
                <span className="loading-spinner"></span>
              ) : mode === 'login' ? (
                <>
                  <FiLogIn /> Login
                </>
              ) : (
                <>
                  <FiUserPlus /> Register
                </>
              )}
            </button>
          </form>
        </div>

        <div className="auth-illustration">
          <div className="illustration-content">
          <h2>NSS IITR Portal</h2>
          <p>Registration and Donation Management System</p>
          <div className="illustration-icons">
            <span>🏛️</span>
            <span>📊</span>
            <span>💳</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
