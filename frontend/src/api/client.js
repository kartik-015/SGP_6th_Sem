import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env?.VITE_API_URL || "http://localhost:5000";

export const API = axios.create({ 
  baseURL,
  withCredentials: false // Disable credentials to avoid CORS issues in dev unless explicitly needed
});

// Request interceptor to add auth token if needed
API.interceptors.request.use(
  (config) => {
    // Attach bearer token if stored
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || "An error occurred";
    const statusCode = error.response?.status;
    
    // Don't show toast for 401 (unauthorized) as it's handled by auth logic
    if (statusCode !== 401) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);


