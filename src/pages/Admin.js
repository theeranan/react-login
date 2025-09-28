// ตัวอย่าง src/pages/Admin.js
import React from "react";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";

export default function Admin() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 flex-1 overflow-auto">
          <h1>Admin Dashboard</h1>
          {/* ใส่เนื้อหาเฉพาะฝั่งแอดมิน */}
        </main>
        <Footer />
      </div>
    </div>
  );
}
