import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL of our Node.js backend
});

// Interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

// Auth functions
export const register = (userData: any) => api.post('/auth/register', userData);
export const login = (userData: any) => api.post('/auth/login', userData);
export const getLoggedInUser = () => api.get('/auth');

// Playlist functions
export const getPlaylists = () => api.get('/playlists');
export const createPlaylist = (playlistData: any) => api.post('/playlists', playlistData);
