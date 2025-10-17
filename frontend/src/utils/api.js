import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle different error status codes
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login/student';
          toast.error('Session expired. Please login again.');
          break;
          
        case 403:
          // Forbidden
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
          
        case 404:
          // Not found
          toast.error('Resource not found.');
          break;
          
        case 422:
          // Validation error
          const validationErrors = response.data.errors;
          if (validationErrors && Array.isArray(validationErrors)) {
            validationErrors.forEach(error => {
              toast.error(error.msg || error.message);
            });
          } else {
            toast.error(response.data.message || 'Validation failed.');
          }
          break;
          
        case 429:
          // Too many requests
          toast.error('Too many requests. Please try again later.');
          break;
          
        case 500:
          // Server error
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          // Other errors
          toast.error(response.data.message || 'An error occurred.');
      }
    } else {
      // Network error
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// API helper functions
export const apiHelpers = {
  // Equipment
  getEquipment: (params = {}) => api.get('/equipment', { params }),
  getEquipmentById: (id) => api.get(`/equipment/${id}`),
  getEquipmentCategories: () => api.get('/equipment/categories'),
  
  // Requests
  createRequest: (data) => api.post('/requests', data),
  getRequests: (params = {}) => api.get('/requests', { params }),
  getRequestById: (id) => api.get(`/requests/${id}`),
  approveRequest: (id) => api.put(`/requests/${id}/approve`),
  rejectRequest: (id, reason) => api.put(`/requests/${id}/reject`, { reason }),
  markAsBorrowed: (id) => api.put(`/requests/${id}/borrow`),
  markAsReturned: (id, isDamaged = false) => api.put(`/requests/${id}/return`, { isDamaged }),
  
  // Students
  getStudents: (params = {}) => api.get('/students', { params }),
  getStudentById: (id) => api.get(`/students/${id}`),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  getStudentRequests: (id, params = {}) => api.get(`/students/${id}/requests`, { params }),
  getStudentStats: (id) => api.get(`/students/${id}/stats`),
  verifyStudent: (id) => api.put(`/students/${id}/verify`),
  deactivateStudent: (id) => api.put(`/students/${id}/deactivate`),
  getDepartments: () => api.get('/students/departments'),
  
  // Notifications
  getNotifications: (params = {}) => api.get('/notifications', { params }),
  markNotificationAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllNotificationsAsRead: () => api.put('/notifications/read-all'),
  createNotification: (data) => api.post('/notifications', data),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  getNotificationStats: () => api.get('/notifications/stats'),
  
  // Admin specific
  getEquipmentStats: () => api.get('/equipment/stats/overview'),
  getRequestStats: () => api.get('/requests/stats/overview'),
  
  // File upload
  uploadFile: (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/upload/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // QR Code scanning
  scanQRCode: (data) => api.post('/scan/qr', data),
  
  // Health check
  healthCheck: () => api.get('/health'),
};

export default api; 