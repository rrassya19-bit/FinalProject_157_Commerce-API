import api from './axiosInstance';

export const kategoriApi = {
  getAll: () => api.get('/api/v1/kategori'),
  getById: (id) => api.get(`/api/v1/kategori/${id}`),
  create: (data) => api.post('/api/v1/kategori', data),
  update: (id, data) => api.put(`/api/v1/kategori/${id}`, data),
  delete: (id) => api.delete(`/api/v1/kategori/${id}`),
};
