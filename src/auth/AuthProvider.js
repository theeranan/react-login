// src/auth/AuthProvider.jsx (ย่อ)
import React, { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("accessToken");
    if (t) {
      setToken(t);
      setUser(jwt_decode(t)); // { sub, name, roles, exp }
    }
  }, []);

  const login = (t) => {
    localStorage.setItem("accessToken", t);
    setToken(t);
    setUser(jwt_decode(t));
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
