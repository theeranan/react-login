import API from './api';

export const customerService = {
  // Get all customers
  getAll: async () => {
    const response = await API.get('/customers');
    return response.data;
  },

  // Get one customer
  getOne: async (customerId) => {
    const response = await API.get(`/customers/${customerId}`);
    return response.data;
  },

  // Create customer
  create: async (customerData) => {
    const response = await API.post('/customers', customerData);
    return response.data;
  },

  // Update customer
  update: async (customerId, customerData) => {
    const response = await API.patch(`/customers/${customerId}`, customerData);
    return response.data;
  },

  // Delete customer
  delete: async (customerId) => {
    const response = await API.delete(`/customers/${customerId}`);
    return response.data;
  },

  // Get active customers
  getActive: async () => {
    const response = await API.get('/customers/status/active');
    return response.data;
  },

  // Checkout customer
  checkout: async (customerId, dateOut) => {
    const response = await API.patch(`/customers/${customerId}/checkout`, { DateOut: dateOut });
    return response.data;
  },
};

export default customerService;