// นำเข้าเครื่องมือสำหรับสลับหน้าเว็บ (เหมือนการเปลี่ยนหน้าหนังสือ)
import { Routes, Route, Navigate } from "react-router-dom";
// นำเข้าหน้าเข้าสู่ระบบ (หน้าที่ใส่ชื่อกับรหัสผ่าน)
import Login from "./Login";
// นำเข้าหน้าสมัครสมาชิก (หน้าที่กรอกข้อมูลเพื่อสร้างบัญชีใหม่)
import Register from "./Register";
// นำเข้าหน้าแดชบอร์ด (หน้าหลักที่แสดงข้อมูลสรุปต่างๆ)
import Dashboard from "./Dashboard";
// นำเข้าหน้าจัดการข้อมูลลูกค้า
import Customers from "./Customers";
// นำเข้าหน้าจัดการข้อมูลห้องพัก
import Rooms from "./Rooms";
// นำเข้าหน้าจัดการข้อมูลการชำระเงิน
import Payments from "./Payments";
// นำเข้าหน้าจัดการข้อมูลการซ่อมแซม
import Repairs from "./Repairs";
// นำเข้าหน้าจัดการข้อมูลพนักงาน
import Employees from "./Employees";
// นำเข้าหน้าจัดการข้อมูลผู้ใช้งานระบบ
import Users from "./Users";
// นำเข้าโครงสร้างหน้าเว็บหลัก (เมนูด้านข้าง, ส่วนหัว)
import Layout from "../components/Layout";
// นำเข้าตัวคุ้มกันเส้นทาง (ไม่ให้คนที่ยังไม่ได้เข้าสู่ระบบเข้าถึง)
import ProtectedRoute from "../auth/ProtectedRoute";
// นำเข้าหน้าแจ้งเตือนว่าไม่มีสิทธิ์เข้าถึง
import Unauthorized from "./Unauthorized";

// สร้างฟังก์ชัน App ซึ่งเป็นหน้าหลักของเว็บไซต์ทั้งหมด
function App() {
  // คืนค่าส่วนแสดงผล (เหมือนวาดภาพที่จะโชว์บนหน้าจอ)
  return (
    // กล่องใส่เส้นทางทั้งหมดของเว็บไซต์
    <Routes>
      {/* เมื่อเข้าหน้าแรก (/) ให้เปลี่ยนไปหน้า /login ทันที */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* เส้นทาง /login จะแสดงหน้าเข้าสู่ระบบ */}
      <Route path="/login" element={<Login />} />
      {/* เส้นทาง /register จะแสดงหน้าสมัครสมาชิก */}
      <Route path="/register" element={<Register />} />
      {/* เส้นทาง /unauthorized จะแสดงหน้าแจ้งว่าไม่มีสิทธิ์ */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* กลุ่มเส้นทางที่ต้องเข้าสู่ระบบก่อน (มีตัวคุ้มกัน) */}
      <Route
        path="/"
        element={
          // ห่อด้วย ProtectedRoute เพื่อตรวจสอบว่าเข้าสู่ระบบแล้วหรือยัง
          <ProtectedRoute>
            {/* ใช้โครงสร้างหน้าเว็บหลัก (มีเมนู) */}
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* เส้นทาง /dashboard จะแสดงหน้าแดชบอร์ด (หน้าหลักหลังเข้าสู่ระบบ) */}
        <Route path="dashboard" element={<Dashboard />} />
        {/* เส้นทาง /customers จะแสดงหน้าจัดการลูกค้า */}
        <Route path="customers" element={<Customers />} />
        {/* เส้นทาง /rooms จะแสดงหน้าจัดการห้องพัก */}
        <Route path="rooms" element={<Rooms />} />
        {/* เส้นทาง /payments จะแสดงหน้าจัดการการชำระเงิน */}
        <Route path="payments" element={<Payments />} />
        {/* เส้นทาง /repairs จะแสดงหน้าจัดการการซ่อมแซม */}
        <Route path="repairs" element={<Repairs />} />
        {/* เส้นทาง /employees จะแสดงหน้าจัดการพนักงาน */}
        <Route path="employees" element={<Employees />} />
        {/* เส้นทาง /users จะแสดงหน้าจัดการผู้ใช้งานระบบ */}
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
}

// ส่งออกฟังก์ชัน App ให้ไฟล์อื่นนำไปใช้ได้
export default App;
