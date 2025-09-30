import API from './api';

export const repairService = {
  // Get all repairs
  getAll: async () => {
    const response = await API.get('/repairs');
    return response.data;
  },

  // Get one repair
  getOne: async (repairId) => {
    const response = await API.get(`/repairs/${repairId}`);
    return response.data;
  },

  // Create repair request
  create: async (repairData) => {
    const response = await API.post('/repairs', repairData);
    return response.data;
  },

  // Update repair
  update: async (repairId, repairData) => {
    const response = await API.patch(`/repairs/${repairId}`, repairData);
    return response.data;
  },

  // Delete repair
  delete: async (repairId) => {
    const response = await API.delete(`/repairs/${repairId}`);
    return response.data;
  },

  // Get repairs by status
  getByStatus: async (status) => {
    const response = await API.get(`/repairs/status/${status}`);
    return response.data;
  },

  // Get pending repairs
  getPending: async () => {
    const response = await API.get('/repairs/pending');
    return response.data;
  },

  // Get repairs by room
  getByRoom: async (roomNumber) => {
    const response = await API.get(`/repairs/room/${roomNumber}`);
    return response.data;
  },

  // Update repair status
  updateStatus: async (repairId, status) => {
    const response = await API.patch(`/repairs/${repairId}/status`, { Status: status });
    return response.data;
  },
};

export default repairService;