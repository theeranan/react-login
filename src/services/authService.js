import API from './api';

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await API.post('/login', { email, password });
    return response.data;
  },

  // Register
  register: async (email, password) => {
    const response = await API.post('/register', { email, password });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await API.get('/auth/users');
    return response.data;
  },
};

export default authService;