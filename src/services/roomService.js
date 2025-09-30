import API from './api';

export const roomService = {
  // Get all rooms
  getAll: async () => {
    const response = await API.get('/rooms');
    return response.data;
  },

  // Get one room
  getOne: async (roomNumber) => {
    const response = await API.get(`/rooms/${roomNumber}`);
    return response.data;
  },

  // Create room
  create: async (roomData) => {
    const response = await API.post('/rooms', roomData);
    return response.data;
  },

  // Update room
  update: async (roomNumber, roomData) => {
    const response = await API.patch(`/rooms/${roomNumber}`, roomData);
    return response.data;
  },

  // Delete room
  delete: async (roomNumber) => {
    const response = await API.delete(`/rooms/${roomNumber}`);
    return response.data;
  },

  // Get available rooms
  getAvailable: async () => {
    const response = await API.get('/rooms/available');
    return response.data;
  },
};

export default roomService;