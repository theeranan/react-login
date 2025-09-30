// นำเข้าตัวช่วยสำหรับคุยกับเซิร์ฟเวอร์
import API from './api';

// สร้างกล่องเครื่องมือสำหรับจัดการข้อมูลห้องพัก
export const roomService = {
  // ฟังก์ชันดูรายการห้องพักทั้งหมด
  getAll: async () => {
    // ขอรายการห้องพักทั้งหมดจากเซิร์ฟเวอร์
    const response = await API.get('/rooms');
    // ส่งรายการห้องพักกลับมา
    return response.data;
  },

  // ฟังก์ชันดูข้อมูลห้องใดห้องหนึ่ง
  getOne: async (roomNumber) => {
    // ขอข้อมูลห้องหมายเลข ___ จากเซิร์ฟเวอร์
    const response = await API.get(`/rooms/${roomNumber}`);
    // ส่งข้อมูลห้องนั้นกลับมา
    return response.data;
  },

  // ฟังก์ชันเพิ่มห้องพักใหม่
  create: async (roomData) => {
    // ส่งข้อมูลห้องพักใหม่ไปบันทึกที่เซิร์ฟเวอร์
    const response = await API.post('/rooms', roomData);
    // ส่งข้อมูลห้องที่เพิ่งสร้างกลับมา
    return response.data;
  },

  // ฟังก์ชันแก้ไขข้อมูลห้องพัก (เช่น เปลี่ยนราคา, สถานะ)
  update: async (roomNumber, roomData) => {
    // ส่งข้อมูลใหม่ไปแก้ไขห้องหมายเลข ___ ที่เซิร์ฟเวอร์
    const response = await API.patch(`/rooms/${roomNumber}`, roomData);
    // ส่งข้อมูลที่แก้ไขแล้วกลับมา
    return response.data;
  },

  // ฟังก์ชันลบห้องพัก
  delete: async (roomNumber) => {
    // บอกเซิร์ฟเวอร์ให้ลบห้องหมายเลข ___
    const response = await API.delete(`/rooms/${roomNumber}`);
    // ส่งคำตอบจากเซิร์ฟเวอร์กลับมา
    return response.data;
  },

  // ฟังก์ชันดูเฉพาะห้องที่ว่าง (พร้อมให้เช่า)
  getAvailable: async () => {
    // ขอรายการห้องที่ว่างจากเซิร์ฟเวอร์
    const response = await API.get('/rooms/available');
    // ส่งรายการห้องว่างกลับมา
    return response.data;
  },
};

// ส่งออกให้ไฟล์อื่นนำไปใช้งาน
export default roomService;