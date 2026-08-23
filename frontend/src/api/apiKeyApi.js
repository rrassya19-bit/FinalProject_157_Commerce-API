import api from './axiosInstance';

export const apiKeyApi = {
  list: () => api.get('/api-keys'),
  create: (data) => api.post('/api-keys', data),
  delete: (id) => api.delete(`/api-keys/${id}`),
};
