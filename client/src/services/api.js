import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// Attach JWT token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('pizzahub_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize error responses
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// ── Auth ──
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
};

// ── Pizzas ──
export const pizzaAPI = {
  getAll: (params) => API.get('/pizzas', { params }),
  getById: (id) => API.get(`/pizzas/${id}`),
  create: (data) => API.post('/pizzas', data),
  update: (id, data) => API.put(`/pizzas/${id}`, data),
  delete: (id) => API.delete(`/pizzas/${id}`),
};

// ── Orders ──
export const orderAPI = {
  place: (data) => API.post('/orders', data),
  myOrders: () => API.get('/orders/my-orders'),
  getById: (id) => API.get(`/orders/${id}`),
  adminAll: (params) => API.get('/orders/admin/all', { params }),
  updateStatus: (id, status) => API.patch(`/orders/admin/${id}/status`, { status }),
};

// ── Users ──
export const userAPI = {
  me: () => API.get('/users/me'),
  updateMe: (data) => API.patch('/users/me', data),
  dashboard: () => API.get('/users/admin/dashboard'),
  allUsers: () => API.get('/users/admin/users'),
};

export default API;
