import React from "react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-white shadow-inner p-4 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} ระบบจัดการหอพัก. สงวนลิขสิทธิ์.
    </footer>
  );
}