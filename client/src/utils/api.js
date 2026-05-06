import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://civic-crime-api.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reportAPI = {
  createReport: (data) => {
    // Determine whether data is FormData (has files) or JSON
    const isFormData = data instanceof FormData;
    return api.post('/reports', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },
  getReports: (params) => api.get('/reports', { params }),
  getReport: (id) => api.get(`/reports/${id}`),
  getReportsNearby: (params) => api.get('/reports/nearby', { params }),
  updateReportStatus: (id, data) => api.patch(`/reports/${id}/status`, data),
  addResponse: (id, data) => api.post(`/reports/${id}/response`, data),
  deleteReport: (id) => api.delete(`/reports/${id}`),
  getCrimeStats: () => api.get('/reports/stats/all')
};

export const adminAPI = {
  register: (data) => api.post('/admins/register', data),
  login: (data) => api.post('/admins/login', data),
  getCurrentAdmin: () => api.get('/admins/me'),
  getAllAdmins: () => api.get('/admins'),
  updateAdmin: (id, data) => api.patch(`/admins/${id}`, data),
  deleteAdmin: (id) => api.delete(`/admins/${id}`)
};

export default api;
