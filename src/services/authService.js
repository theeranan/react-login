// นำเข้าตัวช่วยสำหรับคุยกับเซิร์ฟเวอร์
import API from './api';

// สร้างกล่องเครื่องมือสำหรับจัดการเรื่องการเข้าสู่ระบบและสมัครสมาชิก
export const authService = {
  // ฟังก์ชันเข้าสู่ระบบ (ใช้อีเมลและรหัสผ่าน)
  login: async (email, password) => {
    // ส่งอีเมลและรหัสผ่านไปให้เซิร์ฟเวอร์ตรวจสอบ
    const response = await API.post('/login', { email, password });
    // ส่งข้อมูลที่ได้กลับมา (มักจะมี token สำหรับใช้งานต่อ)
    return response.data;
  },

  // ฟังก์ชันสมัครสมาชิกใหม่
  register: async (email, password) => {
    // ส่งอีเมลและรหัสผ่านไปสร้างบัญชีใหม่ที่เซิร์ฟเวอร์
    const response = await API.post('/register', { email, password });
    // ส่งข้อมูลบัญชีที่สร้างแล้วกลับมา
    return response.data;
  },

  // ฟังก์ชันดึงข้อมูลผู้ใช้ปัจจุบัน (คนที่กำลังเข้าสู่ระบบอยู่)
  getCurrentUser: async () => {
    // ขอข้อมูลผู้ใช้จากเซิร์ฟเวอร์ (ใช้ token ที่เก็บไว้)
    const response = await API.get('/auth/users');
    // ส่งข้อมูลผู้ใช้กลับมา
    return response.data;
  },
};

// ส่งออกให้ไฟล์อื่นนำไปใช้งาน
export default authService;