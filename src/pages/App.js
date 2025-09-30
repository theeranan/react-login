import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Customers from "./Customers";
import Rooms from "./Rooms";
import Payments from "./Payments";
import Repairs from "./Repairs";
import Employees from "./Employees";
import Users from "./Users";
import Layout from "../components/Layout";
import ProtectedRoute from "../auth/ProtectedRoute";
import Unauthorized from "./Unauthorized";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="payments" element={<Payments />} />
        <Route path="repairs" element={<Repairs />} />
        <Route path="employees" element={<Employees />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
}

export default App;
