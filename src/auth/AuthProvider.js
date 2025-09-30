// นำเข้าเครื่องมือจาก React
import React, { createContext, useState, useEffect } from "react";

// สร้างกล่องแบ่งปันข้อมูล (Context) สำหรับเก็บข้อมูลผู้ใช้ที่เข้าสู่ระบบ
export const AuthContext = createContext();

// สร้างตัวจัดการระบบเข้าสู่ระบบ (AuthProvider)
export const AuthProvider = ({ children }) => {
  // สร้างตัวเก็บ token (กุญแจพิเศษ) - ตอนแรกยังไม่มี (null)
  const [token, setToken] = useState(null);
  // สร้างตัวเก็บข้อมูลผู้ใช้ - ตอนแรกยังไม่มี (null)
  const [user, setUser] = useState(null);
  // สร้างตัวบอกว่ากำลังโหลดข้อมูลอยู่หรือไม่ - ตอนแรกกำลังโหลด (true)
  const [loading, setLoading] = useState(true);

  // เมื่อเปิดเว็บครั้งแรก ให้ทำงานนี้
  useEffect(() => {
    // ลองดูว่ามี token เก็บไว้ในกล่องเก็บของ (localStorage) หรือไม่
    const storedToken = localStorage.getItem("token");
    // ลองดูว่ามีข้อมูลผู้ใช้เก็บไว้หรือไม่
    const storedUser = localStorage.getItem("user");

    // ถ้ามีทั้ง token และข้อมูลผู้ใช้เก็บไว้ (เคยเข้าสู่ระบบไว้)
    if (storedToken && storedUser) {
      // ใส่ token ที่เจอไว้ในระบบ
      setToken(storedToken);
      // แปลงข้อมูลผู้ใช้จากข้อความเป็น object แล้วเก็บไว้
      setUser(JSON.parse(storedUser));
    }
    // บอกว่าโหลดเสร็จแล้ว
    setLoading(false);
  }, []);

  // ฟังก์ชันสำหรับเข้าสู่ระบบ (เมื่อล็อกอินสำเร็จ)
  const login = (token, userData) => {
    // เก็บ token ไว้ในกล่องเก็บของ
    localStorage.setItem("token", token);
    // เก็บข้อมูลผู้ใช้ไว้ในกล่องเก็บของ (แปลงเป็นข้อความก่อน)
    localStorage.setItem("user", JSON.stringify(userData));
    // อัพเดท token ในระบบ
    setToken(token);
    // อัพเดทข้อมูลผู้ใช้ในระบบ
    setUser(userData);
  };

  // ฟังก์ชันสำหรับออกจากระบบ
  const logout = () => {
    // ลบ token ออกจากกล่องเก็บของ
    localStorage.removeItem("token");
    // ลบข้อมูลผู้ใช้ออกจากกล่องเก็บของ
    localStorage.removeItem("user");
    // ลบ token ออกจากระบบ (ตั้งเป็น null)
    setToken(null);
    // ลบข้อมูลผู้ใช้ออกจากระบบ (ตั้งเป็น null)
    setUser(null);
  };

  // ส่งคืนส่วนแสดงผล พร้อมแจกจ่ายข้อมูล token, user, login, logout, loading ให้ทุกคนใช้
  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
