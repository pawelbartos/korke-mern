import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  getCurrentUser: () => api.get('/auth/me').then(res => res.data),
  logout: () => api.post('/auth/logout').then(res => res.data),
  sendOTP: (data) => api.post('/auth/send-otp', data).then(res => res.data),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }).then(res => res.data),
  resendOTP: (email) => api.post('/auth/resend-otp', { email }).then(res => res.data),
  testEmail: () => api.post('/auth/test-email').then(res => res.data),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile').then(res => res.data),
  updateProfile: (data) => api.put('/users/profile', data).then(res => res.data),
  updateTeacherProfile: (data) => api.put('/users/profile/teacher', data).then(res => res.data),
  getUser: (id) => api.get(`/users/${id}`).then(res => res.data),
  getTeachers: (params) => api.get('/users/teachers', { params }).then(res => res.data),
};

// Tutoring API
export const tutoringAPI = {
  getAds: (params) => {
    console.log('🌐 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:5000/api');
    console.log('📤 Making request to /tutoring with params:', params);
    return api.get('/tutoring', { params }).then(res => {
      console.log('📥 Response received:', res.data);
      return res.data;
    }).catch(err => {
      console.error('🚨 API request failed:', err);
      throw err;
    });
  },
  getAd: (id) => api.get(`/tutoring/${id}`).then(res => res.data),
  createAd: (data) => api.post('/tutoring', data).then(res => res.data),
  updateAd: (id, data) => api.put(`/tutoring/${id}`, data).then(res => res.data),
  deleteAd: (id) => api.delete(`/tutoring/${id}`).then(res => res.data),
  searchAds: (params) => api.get('/tutoring/search', { params }).then(res => res.data),
  applyForAd: (id, data) => api.post(`/tutoring/${id}/apply`, data).then(res => res.data),
  getApplications: (id) => api.get(`/tutoring/${id}/applications`).then(res => res.data),
  getMyApplications: () => api.get('/tutoring/applications/my').then(res => res.data),
  updateApplication: (adId, applicationId, data) => 
    api.put(`/tutoring/${adId}/applications/${applicationId}`, data).then(res => res.data),
  toggleFavorite: (id) => api.post(`/tutoring/${id}/favorite`).then(res => res.data),
  getFavorites: () => api.get('/tutoring/favorites').then(res => res.data),
  getReviews: (id) => api.get(`/tutoring/${id}/reviews`).then(res => res.data),
  createReview: (id, data) => api.post(`/tutoring/${id}/reviews`, data).then(res => res.data),
};

// Messages API
export const messageAPI = {
  getConversations: () => api.get('/messages/conversations').then(res => res.data),
  getMessages: (userId) => api.get(`/messages/${userId}`).then(res => res.data),
  sendMessage: (data) => api.post('/messages', data).then(res => res.data),
  markAsRead: (id) => api.put(`/messages/${id}/read`).then(res => res.data),
  getUnreadCount: () => api.get('/messages/unread/count').then(res => res.data),
};

// Reviews API
export const reviewAPI = {
  getUserReviews: (userId, params) => api.get(`/reviews/user/${userId}`, { params }).then(res => res.data),
  createReview: (data) => api.post('/reviews', data).then(res => res.data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data).then(res => res.data),
  deleteReview: (id) => api.delete(`/reviews/${id}`).then(res => res.data),
  markHelpful: (id, data) => api.post(`/reviews/${id}/helpful`, data).then(res => res.data),
};

export default api; 