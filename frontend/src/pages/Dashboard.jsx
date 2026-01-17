import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donationAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalCount: 0,
    successCount: 0,
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await donationAPI.getMyDonations();
      setDonations(response.data);
      
     
      const successDonations = response.data.filter(d => d.paymentStatus === 'success');
      setStats({
        totalDonated: successDonations.reduce((sum, d) => sum + d.amountPaid, 0),
        totalCount: response.data.length,
        successCount: successDonations.length,
      });
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <span className="status-icon success">✓</span>;
      case 'pending':
        return <span className="status-icon pending">⏳</span>;
      case 'failed':
        return <span className="status-icon failed">✗</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="dashboard">
      <div className="container">
        {/* Welcome Section */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Dashboard</h1>
            <p>Your registration and donation records.</p>
          </div>
          <Link to="/donate" className="btn btn-primary">
            Make a Donation
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">
            </div>
            <div className="stat-info">
              <h3>₹{stats.totalDonated.toLocaleString()}</h3>
              <p>Total Donated</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pink">
            </div>
            <div className="stat-info">
              <h3>{stats.successCount}</h3>
              <p>Successful Donations</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon mint">
            </div>
            <div className="stat-info">
              <h3>{stats.totalCount}</h3>
              <p>Total Transactions</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Donation History
          </button>
        </div>

        {/* Profile Section */}
        {activeTab === 'profile' && (
          <div className="dashboard-section profile-section">
            <h2>Your Profile</h2>
            <div className="profile-card">
              <div className="profile-avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="profile-details">
                <div className="profile-row">
                  <div>
                    <span className="profile-label">Full Name</span>
                    <span className="profile-value">{user?.name || 'N/A'}</span>
                  </div>
                </div>
                <div className="profile-row">
                  <div>
                    <span className="profile-label">Email Address</span>
                    <span className="profile-value">{user?.email || 'N/A'}</span>
                  </div>
                </div>
                <div className="profile-row">
                  <div>
                    <span className="profile-label">Account Role</span>
                    <span className="profile-value role-tag">{user?.role || 'supporter'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donation History */}
        {activeTab === 'history' && (
        <div className="dashboard-section">
          <h2>Your Donation History</h2>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner large"></div>
              <p>Loading your donations...</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💝</div>
              <h3>No donations yet</h3>
              <p>Start your giving journey today and make a difference!</p>
              <Link to="/donate" className="btn btn-primary">
                Make Your First Donation
              </Link>
            </div>
          ) : (
            <div className="donations-table-container">
              <table className="donations-table">
                <thead>
                  <tr>
                    <th>Reference ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation._id}>
                      <td>
                        <span className="reference-id">{donation.orderRef}</span>
                      </td>
                      <td>
                        <span className="amount">₹{donation.amountPaid.toLocaleString()}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${donation.paymentStatus}`}>
                          {getStatusIcon(donation.paymentStatus)}
                          {donation.paymentStatus}
                        </span>
                      </td>
                      <td>{formatDate(donation.transactionTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
