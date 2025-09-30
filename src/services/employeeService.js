import API from './api';

export const employeeService = {
  // Get all employees
  getAll: async () => {
    const response = await API.get('/employees');
    return response.data;
  },

  // Get active employees
  getActive: async () => {
    const response = await API.get('/employees/active');
    return response.data;
  },

  // Get one employee
  getOne: async (empId) => {
    const response = await API.get(`/employees/${empId}`);
    return response.data;
  },

  // Create employee
  create: async (employeeData) => {
    const response = await API.post('/employees', employeeData);
    return response.data;
  },

  // Update employee
  update: async (empId, employeeData) => {
    const response = await API.patch(`/employees/${empId}`, employeeData);
    return response.data;
  },

  // Delete employee
  delete: async (empId) => {
    const response = await API.delete(`/employees/${empId}`);
    return response.data;
  },
};

export default employeeService;