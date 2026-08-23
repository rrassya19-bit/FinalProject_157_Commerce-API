import api from './axiosInstance';

export const produkApi = {
  getAll: (params) => api.get('/api/v1/produk', { params }),
  getById: (id) => api.get(`/api/v1/produk/${id}`),
  create: (data) => api.post('/api/v1/produk', data),
  update: (id, data) => api.put(`/api/v1/produk/${id}`, data),
  delete: (id) => api.delete(`/api/v1/produk/${id}`),
};
