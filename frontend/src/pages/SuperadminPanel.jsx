import { useState, useEffect } from 'react';
import { FiDownload, FiCheck } from 'react-icons/fi';
import { adminAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const SuperadminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalRegistrations: 0, totalCollected: 0 });
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [insights, setInsights] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, donationsRes, insightsRes, pendingRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getAllDonations(),
        adminAPI.getInsights(),
        adminAPI.getPendingAdmins(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setDonations(donationsRes.data);
      setInsights(insightsRes.data);
      setPendingAdmins(pendingRes.data);
    } catch (error) {
      console.error('Error fetching superadmin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (adminId) => {
    try {
      await adminAPI.approveAdmin(adminId);
      setPendingAdmins((prev) => prev.filter((a) => a._id !== adminId));
    } catch (error) {
      console.error('Error approving admin:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await adminAPI.getUsers(searchTerm);
      setUsers(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await adminAPI.exportReport();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ngo_members.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const handleExportDonorTotals = async () => {
    try {
      const response = await adminAPI.exportDonorTotals();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'donor_totals.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting donor totals:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      success: 'status-badge success',
      pending: 'status-badge pending',
      failed: 'status-badge failed',
    };
    return <span className={statusClasses[status] || 'status-badge'}>{status}</span>;
  };

  // Process insights data for charts
  const chartData = insights.map((item) => ({
    date: item._id,
    amount: item.dailyTotal,
    transactions: item.transactionCount,
  }));

  // Filter donations
  const filteredDonations = donations.filter((d) => {
    if (filterStatus && d.paymentStatus !== filterStatus) return false;
    return true;
  });

  const renderOverview = () => (
    <div className="admin-overview">
      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card purple">
          <div className="stat-content">
            <div className="stat-icon"></div>
            <div>
              <h3>{stats.totalRegistrations}</h3>
              <p>Total Supporters</p>
            </div>
          </div>
        </div>
        <div className="admin-stat-card green">
          <div className="stat-content">
            <div className="stat-icon"></div>
            <div>
              <h3>₹{stats.totalCollected?.toLocaleString()}</h3>
              <p>Total Funds Raised</p>
            </div>
          </div>
        </div>
        <div className="admin-stat-card pink">
          <div className="stat-content">
            <div className="stat-icon"></div>
            <div>
              <h3>{donations.filter((d) => d.paymentStatus === 'failed').length}</h3>
              <p>Failed Transactions</p>
            </div>
          </div>
        </div>
        <div className="admin-stat-card mint">
          <div className="stat-content">
            <div className="stat-icon"></div>
            <div>
              <h3>{insights.length}</h3>
              <p>Active Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {chartData.length > 0 && (
        <div className="charts-section">
          <div className="chart-card">
            <h3>Donation Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #002366',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="amount" stroke="#002366" strokeWidth={2} dot={{ fill: '#002366' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3>Daily Transactions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #C5A065',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="transactions" fill="#C5A065" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Donations</h3>
        <div className="activity-list">
          {donations.slice(0, 5).map((donation) => (
            <div key={donation._id} className="activity-item">
              <div className="activity-avatar">{donation.donatedBy?.fullName?.charAt(0) || 'A'}</div>
              <div className="activity-details">
                <p className="activity-name">{donation.donatedBy?.fullName || 'Anonymous'}</p>
                <p className="activity-email">{donation.donatedBy?.officialEmail || 'N/A'}</p>
              </div>
              <div className="activity-amount">₹{donation.amountPaid?.toLocaleString()}</div>
              <div className="activity-status">{getStatusBadge(donation.paymentStatus)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPendingAdmins = () => (
    <div className="admin-users">
      <h3>Pending Admin Approvals</h3>
      {pendingAdmins.length === 0 ? (
        <p style={{ padding: '1rem' }}>No pending admin requests.</p>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Registered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingAdmins.map((admin) => (
                <tr key={admin._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{admin.fullName?.charAt(0)}</div>
                      {admin.fullName}
                    </div>
                  </td>
                  <td>{admin.officialEmail}</td>
                  <td>{formatDate(admin.registeredAt)}</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => handleApprove(admin._id)}>
                      <FiCheck /> Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="admin-users">
      <div className="users-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-primary btn-sm" onClick={handleSearch}>
            Search
          </button>
        </div>
        <button className="btn btn-secondary" onClick={handleExport}>
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">{user.fullName?.charAt(0)}</div>
                    {user.fullName}
                  </div>
                </td>
                <td>{user.officialEmail}</td>
                <td>
                  <span className={`role-badge ${user.userRole}`}>{user.userRole}</span>
                </td>
                <td>{formatDate(user.registeredAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDonations = () => (
    <div className="admin-donations">
      <div className="users-header" style={{ marginBottom: '1rem' }}>
        <div className="search-box">
          <label style={{ marginRight: 8 }}>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <button className="btn btn-secondary" onClick={handleExportDonorTotals}>
          Export Donor Totals CSV
        </button>
      </div>
      <div className="donations-table-container">
        <table className="donations-table">
          <thead>
            <tr>
              <th>Reference ID</th>
              <th>Donor</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map((donation) => (
              <tr key={donation._id}>
                <td>
                  <span className="reference-id">{donation.orderRef}</span>
                </td>
                <td>
                  <div className="donor-info">
                    <span className="donor-name">{donation.donatedBy?.fullName || 'Anonymous'}</span>
                    <br />
                    <span className="donor-email">{donation.donatedBy?.officialEmail || 'N/A'}</span>
                  </div>
                </td>
                <td>
                  <span className="amount">₹{donation.amountPaid?.toLocaleString()}</span>
                </td>
                <td>{getStatusBadge(donation.paymentStatus)}</td>
                <td>{formatDate(donation.transactionTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner large"></div>
        <p>Loading superadmin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <h1>Superadmin Dashboard</h1>
          <p>Manage admins, supporters, donations, and view analytics</p>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
          <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
            Pending Admins ({pendingAdmins.length})
          </button>
          <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            Supporters
          </button>
          <button className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}>
            Donations
          </button>
        </div>

        {/* Tab Content */}
        <div className="admin-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'pending' && renderPendingAdmins()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'donations' && renderDonations()}
        </div>
      </div>
    </div>
  );
};

export default SuperadminPanel;
