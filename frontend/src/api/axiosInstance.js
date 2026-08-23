import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Otomatis lampirkan Authorization Bearer JWT & x-api-key jika ada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('commerce_token');
    const activeApiKey = localStorage.getItem('commerce_active_api_key');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (activeApiKey) {
      config.headers['x-api-key'] = activeApiKey;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Tangani error global seperti 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Jika token expired pada request yang butuh auth
      const isAuthRoute = error.config?.url?.includes('/auth/') || error.config?.url?.includes('/api-keys');
      if (isAuthRoute && !error.config?.url?.includes('/auth/login') && !error.config?.url?.includes('/auth/register')) {
        localStorage.removeItem('commerce_token');
        localStorage.removeItem('commerce_user');
        if (window.location.pathname.startsWith('/dashboard')) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
