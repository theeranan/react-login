// ไฟล์เครื่องมือช่วยเรียกใช้ข้อมูลการเข้าสู่ระบบ
// นำเข้าตัวช่วยจาก React เพื่อเรียกใช้ Context (กล่องแบ่งปันข้อมูล)
import { useContext } from "react";
// นำเข้า AuthContext ซึ่งเป็นกล่องที่เก็บข้อมูลผู้ใช้ที่เข้าสู่ระบบ
import { AuthContext } from "./AuthProvider";
// สร้างฟังก์ชัน useAuth เพื่อให้ไฟล์อื่นเรียกใช้ข้อมูล user, token ได้ง่ายๆ
export const useAuth = () => useContext(AuthContext);
