import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ── Response Interceptor ──────────────────────────────────
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

// ── Products ──────────────────────────────────────────────
/**
 * Get all products (instruments)
 * GET /api/products/
 * Returns: [{ id, name, price, description, image, type }, ...]
 */
export const getProducts = () => api.get('/api/products/');

// ── Orders ────────────────────────────────────────────────
/**
 * Create a new instrument order
 * POST /api/orders/
 * Body: { customerName, customerEmail, customerPhone, customerAddress, items, subtotal, tax, shipping, total }
 * Returns: { orderId, status, date }
 */
export const createOrder = (orderData) => api.post('/api/orders/', orderData);

/**
 * Get all orders for a customer by email
 * GET /api/orders/?email=customer@example.com
 */
export const getOrders = (email) => api.get('/api/orders/', { params: { email } });

// ── Enrollments ───────────────────────────────────────────
/**
 * Create a new course enrollment
 * POST /api/enrollments/
 * Body: { courseName, courseId, studentName, studentEmail, studentPhone }
 * Returns: { enrollmentId, status, enrollDate }
 */
export const createEnrollment = (enrollData) => api.post('/api/enrollments/', enrollData);

/**
 * Get all enrollments for a student by email
 * GET /api/enrollments/?email=student@example.com
 */
export const getEnrollments = (email) => api.get('/api/enrollments/', { params: { email } });

// ── Contact ───────────────────────────────────────────────
/**
 * Send a contact/support message
 * POST /api/contact/
 * Body: { name, email, message, phone (optional) }
 * Returns: { success: true, messageId }
 */
export const sendContactMessage = (formData) => api.post('/api/contact/', formData);

export default api;
