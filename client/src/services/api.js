const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  verify: async (token) => {
    const res = await fetch(`${BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  changePassword: async (token, currentPassword, newPassword) => {
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return res.json();
  },

  // Restaurant Info
  getRestaurantInfo: async () => {
    const res = await fetch(`${BASE_URL}/restaurant`);
    return res.json();
  },

  updateRestaurantInfo: async (token, data) => {
    const res = await fetch(`${BASE_URL}/restaurant`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getDashboardStats: async (token) => {
    const res = await fetch(`${BASE_URL}/restaurant/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // Categories
  getCategories: async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    return res.json();
  },

  createCategory: async (token, data) => {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateCategory: async (token, id, data) => {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteCategory: async (token, id) => {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // Menu Items
  getMenuItems: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/menu${query ? `?${query}` : ''}`);
    return res.json();
  },

  getMenuItem: async (id) => {
    const res = await fetch(`${BASE_URL}/menu/${id}`);
    return res.json();
  },

  createMenuItem: async (token, formData) => {
    const res = await fetch(`${BASE_URL}/menu`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    return res.json();
  },

  updateMenuItem: async (token, id, formData) => {
    const res = await fetch(`${BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    return res.json();
  },

  deleteMenuItem: async (token, id) => {
    const res = await fetch(`${BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  toggleAvailability: async (token, id) => {
    const res = await fetch(`${BASE_URL}/menu/${id}/toggle-availability`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  toggleSpecial: async (token, id) => {
    const res = await fetch(`${BASE_URL}/menu/${id}/toggle-special`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // QR Code
  generateQR: async (url, tableNumber) => {
    const params = new URLSearchParams();
    if (url) params.set('url', url);
    if (tableNumber) params.set('tableNumber', tableNumber);
    const res = await fetch(`${BASE_URL}/qr/generate?${params}`);
    return res.json();
  }
};
