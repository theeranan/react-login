import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow p-6">
      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/"
          className="text-gray-700 hover:text-gray-900"
          activeClassName="font-bold"
        >
          หน้าแรก
        </NavLink>
        <NavLink
          to="/login"
          className="text-gray-700 hover:text-gray-900"
          activeClassName="font-bold"
        >
          เข้าสู่ระบบ
        </NavLink>
        {/* เพิ่มลิงก์อื่น ๆ ตามต้องการ */}
      </nav>
    </aside>
  );
}