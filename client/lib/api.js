import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Server unreachable. Is Django running on port 8000?');
    }
    return Promise.reject(error);
  }
);

export const getProducts = () => api.get('/api/products/');

export const createOrder = (orderData) => api.post('/api/orders/', orderData);

export const getOrders = (email) => api.get('/api/orders/', { params: { email } });

export const createEnrollment = (enrollData) => api.post('/api/enrollments/', enrollData);

export const getEnrollments = (email) => api.get('/api/enrollments/', { params: { email } });

export const sendContactMessage = (formData) => api.post('/api/contact/', formData);

export default api;
