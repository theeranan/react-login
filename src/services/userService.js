// นำเข้าตัวช่วยสำหรับคุยกับเซิร์ฟเวอร์
import API from './api';

// สร้างกล่องเครื่องมือสำหรับจัดการข้อมูลผู้ใช้งานระบบ
export const userService = {
  // ฟังก์ชันดูรายชื่อผู้ใช้งานทั้งหมด (ผู้ที่สามารถเข้าสู่ระบบได้)
  getAll: async () => {
    // ขอรายชื่อผู้ใช้งานทั้งหมดจากเซิร์ฟเวอร์
    const response = await API.get('/users');
    // ส่งรายชื่อผู้ใช้งานกลับมา
    return response.data;
  },

  // ฟังก์ชันแก้ไขข้อมูลผู้ใช้งาน (เช่น เปลี่ยนสิทธิ์)
  update: async (userId, userData) => {
    // ส่งข้อมูลใหม่ไปแก้ไขผู้ใช้งานหมายเลข ___ ที่เซิร์ฟเวอร์
    const response = await API.patch(`/users/${userId}`, userData);
    // ส่งข้อมูลที่แก้ไขแล้วกลับมา
    return response.data;
  },

  // ฟังก์ชันลบผู้ใช้งาน
  delete: async (userId) => {
    // บอกเซิร์ฟเวอร์ให้ลบผู้ใช้งานหมายเลข ___
    const response = await API.delete(`/users/${userId}`);
    // ส่งคำตอบจากเซิร์ฟเวอร์กลับมา
    return response.data;
  },
};

// ส่งออกให้ไฟล์อื่นนำไปใช้งาน
export default userService;