// นำเข้าตัวช่วยสำหรับคุยกับเซิร์ฟเวอร์
import API from './api';

// สร้างกล่องเครื่องมือสำหรับจัดการข้อมูลการชำระเงิน
export const paymentService = {
  // ฟังก์ชันดูรายการชำระเงินทั้งหมด
  getAll: async () => {
    // ขอรายการชำระเงินทั้งหมดจากเซิร์ฟเวอร์
    const response = await API.get('/payments');
    // ส่งรายการชำระเงินกลับมา
    return response.data;
  },

  // ฟังก์ชันดูข้อมูลการชำระเงินรายการใดรายการหนึ่ง
  getOne: async (paymentId) => {
    // ขอข้อมูลการชำระเงินหมายเลข ___ จากเซิร์ฟเวอร์
    const response = await API.get(`/payments/${paymentId}`);
    // ส่งข้อมูลการชำระเงินนั้นกลับมา
    return response.data;
  },

  // ฟังก์ชันสร้างรายการชำระเงินใหม่ (เช่น บันทึกค่าเช่าประจำเดือน)
  create: async (paymentData) => {
    // ส่งข้อมูลการชำระเงินใหม่ไปบันทึกที่เซิร์ฟเวอร์
    const response = await API.post('/payments', paymentData);
    // ส่งข้อมูลรายการที่เพิ่งสร้างกลับมา
    return response.data;
  },

  // ฟังก์ชันแก้ไขข้อมูลการชำระเงิน (เช่น เปลี่ยนจำนวนเงิน)
  update: async (paymentId, paymentData) => {
    // ส่งข้อมูลใหม่ไปแก้ไขรายการชำระเงินหมายเลข ___ ที่เซิร์ฟเวอร์
    const response = await API.patch(`/payments/${paymentId}`, paymentData);
    // ส่งข้อมูลที่แก้ไขแล้วกลับมา
    return response.data;
  },

  // ฟังก์ชันลบรายการชำระเงิน
  delete: async (paymentId) => {
    // บอกเซิร์ฟเวอร์ให้ลบรายการชำระเงินหมายเลข ___
    const response = await API.delete(`/payments/${paymentId}`);
    // ส่งคำตอบจากเซิร์ฟเวอร์กลับมา
    return response.data;
  },

  // ฟังก์ชันดูรายการชำระเงินของห้องใดห้องหนึ่ง
  getByRoom: async (roomNumber) => {
    // ขอรายการชำระเงินของห้องหมายเลข ___ จากเซิร์ฟเวอร์
    const response = await API.get(`/payments/room/${roomNumber}`);
    // ส่งรายการชำระเงินของห้องนั้นกลับมา
    return response.data;
  },

  // ฟังก์ชันดูรายการที่ยังไม่ได้จ่าย (ค้างชำระ)
  getUnpaid: async () => {
    // ขอรายการที่ยังไม่ได้ชำระจากเซิร์ฟเวอร์
    const response = await API.get('/payments/unpaid');
    // ส่งรายการค้างชำระกลับมา
    return response.data;
  },

  // ฟังก์ชันทำเครื่องหมายว่าจ่ายแล้ว (เมื่อลูกค้าจ่ายเงิน)
  markAsPaid: async (paymentId) => {
    // บอกเซิร์ฟเวอร์ว่ารายการหมายเลข ___ จ่ายเงินเรียบร้อยแล้ว
    const response = await API.patch(`/payments/${paymentId}/pay`);
    // ส่งข้อมูลที่อัพเดทแล้วกลับมา
    return response.data;
  },
};

// ส่งออกให้ไฟล์อื่นนำไปใช้งาน
export default paymentService;