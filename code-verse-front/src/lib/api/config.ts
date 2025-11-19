import axios from 'axios';

const api = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // Adjust the timeout as needed
  headers: {
    'Content-Type': 'application/json',
    'x-secret-key': import.meta.env.API_BASE_SECRET
  },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
        }
    , (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default api;
