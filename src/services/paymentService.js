import API from './api';

export const paymentService = {
  // Get all payments
  getAll: async () => {
    const response = await API.get('/payments');
    return response.data;
  },

  // Get one payment
  getOne: async (paymentId) => {
    const response = await API.get(`/payments/${paymentId}`);
    return response.data;
  },

  // Create payment
  create: async (paymentData) => {
    const response = await API.post('/payments', paymentData);
    return response.data;
  },

  // Update payment
  update: async (paymentId, paymentData) => {
    const response = await API.patch(`/payments/${paymentId}`, paymentData);
    return response.data;
  },

  // Delete payment
  delete: async (paymentId) => {
    const response = await API.delete(`/payments/${paymentId}`);
    return response.data;
  },

  // Get payments by room
  getByRoom: async (roomNumber) => {
    const response = await API.get(`/payments/room/${roomNumber}`);
    return response.data;
  },

  // Get unpaid payments
  getUnpaid: async () => {
    const response = await API.get('/payments/unpaid');
    return response.data;
  },

  // Mark as paid
  markAsPaid: async (paymentId) => {
    const response = await API.patch(`/payments/${paymentId}/pay`);
    return response.data;
  },
};

export default paymentService;