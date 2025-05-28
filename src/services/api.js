import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/signin', credentials),
  register: (userData) => api.post('/api/auth/signup', userData),
};

// Classification API
export const classificationAPI = {
  classifyImage: (formData) => {
    return api.post('/classification/classify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getClassificationResult: (imageId) => api.get(`/classification/result/${imageId}`),
  getClassificationStatus: (taskId) => api.get(`/classification/status/${taskId}`),
};

// Statistics API
export const statisticsAPI = {
  getUserStatistics: (userId) => api.get(`/statistics/user/${userId}`),
  getUserAchievements: (userId) => api.get(`/statistics/user/${userId}/achievements`),
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobalLeaderboard: (limit = 10) => api.get(`/leaderboards?limit=${limit}`),
  getWeeklyLeaderboard: (limit = 10) => api.get(`/leaderboards/weekly?limit=${limit}`),
  getLeaderboardByMaterial: (material, limit = 10) => api.get(`/leaderboards/material/${material}?limit=${limit}`),
};

// Results API
export const resultsAPI = {
  getUserResults: (userId, page = 0, size = 10) => 
    api.get(`/results/user/${userId}?page=${page}&size=${size}`),
  getResultDetails: (resultId) => api.get(`/results/${resultId}`),
};

export default api;
