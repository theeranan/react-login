// นำเข้าตัวช่วยสำหรับคุยกับเซิร์ฟเวอร์
import API from './api';

// สร้างกล่องเครื่องมือสำหรับจัดการข้อมูลพนักงาน
export const employeeService = {
  // ฟังก์ชันดูรายชื่อพนักงานทั้งหมด
  getAll: async () => {
    // ขอรายชื่อพนักงานทั้งหมดจากเซิร์ฟเวอร์
    const response = await API.get('/employees');
    // ส่งรายชื่อพนักงานกลับมา
    return response.data;
  },

  // ฟังก์ชันดูเฉพาะพนักงานที่ยังทำงานอยู่
  getActive: async () => {
    // ขอรายชื่อพนักงานที่ยังทำงานอยู่จากเซิร์ฟเวอร์
    const response = await API.get('/employees/active');
    // ส่งรายชื่อพนักงานที่ยังทำงานกลับมา
    return response.data;
  },

  // ฟังก์ชันดูข้อมูลพนักงานคนใดคนหนึ่ง
  getOne: async (empId) => {
    // ขอข้อมูลพนักงานหมายเลข ___ จากเซิร์ฟเวอร์
    const response = await API.get(`/employees/${empId}`);
    // ส่งข้อมูลพนักงานคนนั้นกลับมา
    return response.data;
  },

  // ฟังก์ชันเพิ่มพนักงานใหม่ (จ้างพนักงานใหม่)
  create: async (employeeData) => {
    // ส่งข้อมูลพนักงานใหม่ไปบันทึกที่เซิร์ฟเวอร์
    const response = await API.post('/employees', employeeData);
    // ส่งข้อมูลพนักงานที่เพิ่งสร้างกลับมา
    return response.data;
  },

  // ฟังก์ชันแก้ไขข้อมูลพนักงาน (เช่น เปลี่ยนตำแหน่ง, เงินเดือน)
  update: async (empId, employeeData) => {
    // ส่งข้อมูลใหม่ไปแก้ไขพนักงานหมายเลข ___ ที่เซิร์ฟเวอร์
    const response = await API.patch(`/employees/${empId}`, employeeData);
    // ส่งข้อมูลที่แก้ไขแล้วกลับมา
    return response.data;
  },

  // ฟังก์ชันลบข้อมูลพนักงาน (เมื่อลาออก)
  delete: async (empId) => {
    // บอกเซิร์ฟเวอร์ให้ลบข้อมูลพนักงานหมายเลข ___
    const response = await API.delete(`/employees/${empId}`);
    // ส่งคำตอบจากเซิร์ฟเวอร์กลับมา
    return response.data;
  },
};

// ส่งออกให้ไฟล์อื่นนำไปใช้งาน
export default employeeService;