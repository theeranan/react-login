// นำเข้า axios ซึ่งเป็นเครื่องมือสำหรับส่งข้อมูลไปมากับเซิร์ฟเวอร์ (เหมือนพนักงานไปรษณีย์)
import axios from "axios";

// สร้างตัว API ที่มีการตั้งค่าพิเศษไว้แล้ว
const API = axios.create({
  // กำหนดที่อยู่เซิร์ฟเวอร์ที่จะส่งข้อมูลไป (เหมือนที่อยู่บ้านของเพื่อน)
  baseURL: "http://localhost:3001/api",
  // กำหนดว่าข้อมูลที่ส่งไปจะเป็นรูปแบบ JSON (เหมือนพูดภาษาเดียวกัน)
  headers: {
    "Content-Type": "application/json",
  },
});

// ตั้งค่าให้ใส่ token (กุญแจพิเศษ) ทุกครั้งก่อนส่งข้อมูล
API.interceptors.request.use(
  // ฟังก์ชันที่ทำงานก่อนส่งข้อมูลทุกครั้ง
  (config) => {
    // ดึง token จากกล่องเก็บของ (localStorage) ซึ่งเก็บไว้ตอนเข้าสู่ระบบ
    const token = localStorage.getItem("token");
    // ถ้ามี token (เคยเข้าสู่ระบบแล้ว)
    if (token) {
      // ใส่ token ลงในส่วนหัวของข้อมูล เพื่อบอกเซิร์ฟเวอร์ว่าเราเป็นใคร
      config.headers["x-auth-token"] = token;
    }
    // ส่งข้อมูลที่เตรียมไว้ออกไป
    return config;
  },
  // ถ้าเกิดข้อผิดพลาดตอนเตรียมข้อมูล
  (error) => {
    // ส่งข้อผิดพลาดต่อไป
    return Promise.reject(error);
  }
);

// ตั้งค่าการจัดการเมื่อได้รับข้อมูลกลับมาจากเซิร์ฟเวอร์
API.interceptors.response.use(
  // ถ้าได้รับข้อมูลกลับมาปกติ ก็ส่งต่อไปเลย
  (response) => response,
  // ถ้าเกิดข้อผิดพลาด
  (error) => {
    // ถ้าสถานะเป็น 401 แปลว่า token หมดอายุหรือไม่ถูกต้อง (เหมือนกุญแจหมดอายุ)
    if (error.response?.status === 401) {
      // ลบ token ออกจากกล่องเก็บของ
      localStorage.removeItem("token");
      // ลบข้อมูลผู้ใช้ออกจากกล่องเก็บของ
      localStorage.removeItem("user");
      // ส่งกลับไปหน้า login ให้เข้าสู่ระบบใหม่
      window.location.href = "/login";
    }
    // ส่งข้อผิดพลาดต่อไป
    return Promise.reject(error);
  }
);

// ส่งออกตัว API ให้ไฟล์อื่นๆ นำไปใช้งาน (เหมือนแจกพนักงานไปรษณีย์ให้ทุกคน)
export default API;
