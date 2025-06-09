import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

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
  login: (credentials) => api.post('/auth/signin', credentials),
  register: (userData) => api.post('/auth/signup', userData),
};

// Classification API
export const classificationAPI = {
  classifyImage: (formData) => {
    return api.post('/classification/classify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }) ;
  },
  getClassificationResult: (taskId) => api.get(`/classification/result/${taskId}`),
  getClassificationStatus: (taskId) => api.get(`/classification/status/${taskId}`),
};

// Statistics API
export const statisticsAPI = {
  getUserStatistics: (userId) => api.get(`/statistics/user/${userId}`),
  getUserAchievements: (userId) => api.get(`/statistics/user/${userId}/achievements`) ,
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
  getResultDetails: (resultId) => api.get(`/results/id/${resultId}`),
  getResultByImageId: (imageId) => api.get(`/results/${imageId}`),
};

// Achievement API
export const achievementAPI = {
  getAvailableAchievements: () => api.get('/achievements/available'),
  getUserAchievements: (userId) => api.get(`/achievements/user/${userId}`),
  initializeAchievements: () => api.post('/achievements/initialize'),
  checkUserAchievements: (userId) => api.post(`/achievements/check/${userId}`),
};

// Statistics API aggiornate
export const extendedStatisticsAPI = {
  getGlobalWeeklyActivity: () => api.get('/statistics/global/weekly-activity'),
  getGlobalMaterialDistribution: () => api.get('/statistics/global/material-distribution'),
};

// Badge API
export const badgeAPI = {
  generateBadge: () => api.get('/badge/generate', { responseType: 'blob' }),
  previewBadge: () => api.get('/badge/preview'),
};

export default api;
