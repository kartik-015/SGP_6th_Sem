import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login function
  const login = async (credentials, userType) => {
    try {
      setLoading(true);
      const endpoint = userType === 'admin' ? '/auth/admin/login' : '/auth/student/verify-otp';
      const response = await api.post(endpoint, credentials);
      
      const { token: newToken, admin, student } = response.data.data;
      
      // Store token
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Set user
      const userData = admin || student;
      setUser(userData);
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success(response.data.message || 'Login successful!');
      
      // Redirect based on user type
      if (userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Student registration
  const registerStudent = async (formData) => {
    try {
      setLoading(true);
      
      // Debug logging
      console.log('=== FRONTEND REGISTRATION DEBUG ===');
      console.log('FormData being sent:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      console.log('================================');
      
      const response = await api.post('/auth/student/register', formData);
      toast.success(response.data.message || 'Registration successful! Please verify your phone number.');
      return response.data;
    } catch (error) {
      console.error('Registration error details:', error.response?.data);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async (studentId, phoneNumber) => {
    try {
      const response = await api.post('/auth/student/resend-otp', {
        studentId,
        phoneNumber
      });
      toast.success(response.data.message || 'OTP resent successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(message);
      throw error;
    }
  };

  // Send OTP for student login
  const sendStudentLoginOTP = async (studentId, phoneNumber) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/student/login', {
        studentId,
        phoneNumber
      });
      toast.success(response.data.message || 'OTP sent successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    navigate('/');
    toast.success('Logged out successfully!');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const endpoint = user.role === 'admin' ? '/admin/profile' : `/students/${user.id}`;
      const response = await api.put(endpoint, userData);
      setUser(response.data.data);
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw error;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Check if user is student
  const isStudent = () => {
    return user && !user.role;
  };

  const value = {
    user,
    loading,
    token,
    login,
    registerStudent,
    resendOTP,
    sendStudentLoginOTP,
    logout,
    updateProfile,
    isAuthenticated,
    isAdmin,
    isStudent
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 