// ตัวอย่าง src/pages/User.js
import React from "react";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";

export default function User() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 flex-1 overflow-auto">
          <h1>User Dashboard</h1>
          {/* ใส่เนื้อหาสำหรับผู้ใช้งานทั่วไป */}
        </main>
        <Footer />
      </div>
    </div>
  );
}
