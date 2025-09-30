// นำเข้าเครื่องมือจาก React
import React from "react";
// นำเข้าตัวช่วยเปลี่ยนหน้า
import { Navigate } from "react-router-dom";
// นำเข้าตัวช่วยดึงข้อมูลผู้ใช้
import { useAuth } from "./useAuth";

// สร้างตัวคุ้มกันเส้นทาง - ป้องกันไม่ให้คนที่ยังไม่เข้าสู่ระบบเข้าถึงหน้าสำคัญ
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // ดึงข้อมูลผู้ใช้และสถานะการโหลดมาใช้
  const { user, loading } = useAuth();

  // ถ้ายังกำลังโหลดข้อมูลอยู่ (ยังตรวจสอบไม่เสร็จว่าเข้าสู่ระบบหรือยัง)
  if (loading) {
    // แสดงข้อความว่ากำลังโหลด...
    return <div>Loading...</div>;
  }

  // ถ้าไม่มีข้อมูลผู้ใช้ (ยังไม่ได้เข้าสู่ระบบ)
  if (!user) {
    // ส่งกลับไปหน้า login ทันที
    return <Navigate to="/login" replace />;
  }

  // ถ้าไม่ได้กำหนดบทบาทที่อนุญาต (ทุกคนที่เข้าสู่ระบบแล้วเข้าได้)
  if (allowedRoles.length === 0) {
    // ให้แสดงหน้าตามปกติ
    return children;
  }

  // ตรวจสอบว่าผู้ใช้มีบทบาทที่อนุญาตหรือไม่ (เช่น ต้องเป็น admin)
  const hasRole = allowedRoles.includes(user.role);
  // ถ้าไม่มีสิทธิ์
  if (!hasRole) {
    // ส่งไปหน้าแจ้งว่าไม่มีสิทธิ์เข้าถึง
    return <Navigate to="/unauthorized" replace />;
  }

  // ถ้าผ่านการตรวจสอบทั้งหมด ให้แสดงหน้าตามปกติ
  return children;
};

// ส่งออกให้ไฟล์อื่นนำไปใช้งาน
export default ProtectedRoute;
