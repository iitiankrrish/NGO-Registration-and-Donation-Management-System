import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/signin', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
};

// Finance/Donation API
export const donationAPI = {
  createOrder: (amount) => api.post('/finance/create-order', { amount }),
  updateStatus: (data) => api.post('/finance/update-status', data),
  getMyDonations: () => api.get('/finance/my-donations'),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin-portal/stats'),
  getUsers: (searchName = '') => api.get(`/admin-portal/users${searchName ? `?searchName=${searchName}` : ''}`),
  exportReport: () => api.get('/admin-portal/export', { responseType: 'blob' }),
  getInsights: () => api.get('/admin-portal/insights'),
  getAllDonations: () => api.get('/admin-portal/all-donations'),
};

export default api;
