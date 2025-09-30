// นำเข้าตัวช่วยสำหรับคุยกับเซิร์ฟเวอร์
import API from './api';

// สร้างกล่องเครื่องมือสำหรับจัดการข้อมูลลูกค้า
export const customerService = {
  // ฟังก์ชันดูรายชื่อลูกค้าทั้งหมด
  getAll: async () => {
    // ขอรายชื่อลูกค้าทั้งหมดจากเซิร์ฟเวอร์
    const response = await API.get('/customers');
    // ส่งรายชื่อลูกค้ากลับมา
    return response.data;
  },

  // ฟังก์ชันดูข้อมูลลูกค้าคนใดคนหนึ่ง
  getOne: async (customerId) => {
    // ขอข้อมูลลูกค้าหมายเลข ___ จากเซิร์ฟเวอร์
    const response = await API.get(`/customers/${customerId}`);
    // ส่งข้อมูลลูกค้าคนนั้นกลับมา
    return response.data;
  },

  // ฟังก์ชันเพิ่มลูกค้าใหม่ (เช่น เมื่อมีคนมาเช่าห้องใหม่)
  create: async (customerData) => {
    // ส่งข้อมูลลูกค้าใหม่ไปบันทึกที่เซิร์ฟเวอร์
    const response = await API.post('/customers', customerData);
    // ส่งข้อมูลลูกค้าที่เพิ่งสร้างกลับมา
    return response.data;
  },

  // ฟังก์ชันแก้ไขข้อมูลลูกค้า (เช่น เปลี่ยนเบอร์โทร)
  update: async (customerId, customerData) => {
    // ส่งข้อมูลใหม่ไปแก้ไขลูกค้าหมายเลข ___ ที่เซิร์ฟเวอร์
    const response = await API.patch(`/customers/${customerId}`, customerData);
    // ส่งข้อมูลที่แก้ไขแล้วกลับมา
    return response.data;
  },

  // ฟังก์ชันลบข้อมูลลูกค้า
  delete: async (customerId) => {
    // บอกเซิร์ฟเวอร์ให้ลบข้อมูลลูกค้าหมายเลข ___
    const response = await API.delete(`/customers/${customerId}`);
    // ส่งคำตอบจากเซิร์ฟเวอร์กลับมา
    return response.data;
  },

  // ฟังก์ชันดูเฉพาะลูกค้าที่อยู่ในระบบ (ยังอาศัยอยู่)
  getActive: async () => {
    // ขอรายชื่อลูกค้าที่ยังอยู่จากเซิร์ฟเวอร์
    const response = await API.get('/customers/status/active');
    // ส่งรายชื่อลูกค้าที่ยังอยู่กลับมา
    return response.data;
  },

  // ฟังก์ชันทำการ checkout (เมื่อลูกค้าย้ายออก)
  checkout: async (customerId, dateOut) => {
    // บันทึกวันที่ลูกค้าย้ายออก
    const response = await API.patch(`/customers/${customerId}/checkout`, { DateOut: dateOut });
    // ส่งข้อมูลที่อัพเดทแล้วกลับมา
    return response.data;
  },
};

// ส่งออกให้ไฟล์อื่นนำไปใช้งาน
export default customerService;