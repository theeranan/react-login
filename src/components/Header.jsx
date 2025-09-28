import React from "react";

export default function Header({ user }) {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src={user.image}
          alt={user.name}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <h1 className="text-lg font-semibold">{user.name}</h1>
          <p className="text-sm text-gray-500">ห้อง {user.room}</p>
        </div>
      </div>
      <button className="text-gray-600 hover:text-gray-800">
        ลงชื่อออก
      </button>
    </header>
  );
}