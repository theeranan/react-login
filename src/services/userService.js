import API from './api';

export const userService = {
  // Get all users
  getAll: async () => {
    const response = await API.get('/users');
    return response.data;
  },

  // Update user
  update: async (userId, userData) => {
    const response = await API.patch(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  delete: async (userId) => {
    const response = await API.delete(`/users/${userId}`);
    return response.data;
  },
};

export default userService;