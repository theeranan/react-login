import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PaymentIcon from "@mui/icons-material/Payment";
import BuildIcon from "@mui/icons-material/Build";
import WorkIcon from "@mui/icons-material/Work";
import WarningIcon from "@mui/icons-material/Warning";
import customerService from "../services/customerService";
import roomService from "../services/roomService";
import paymentService from "../services/paymentService";
import repairService from "../services/repairService";
import employeeService from "../services/employeeService";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalEmployees: 0,
    unpaidPayments: 0,
    pendingRepairs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        customersData,
        roomsData,
        availableRoomsData,
        employeesData,
        unpaidPaymentsData,
        pendingRepairsData,
      ] = await Promise.all([
        customerService.getActive(),
        roomService.getAll(),
        roomService.getAvailable(),
        employeeService.getActive(),
        paymentService.getUnpaid(),
        repairService.getPending(),
      ]);

      setStats({
        totalCustomers: customersData.length,
        totalRooms: roomsData.length,
        availableRooms: availableRoomsData.length,
        occupiedRooms: roomsData.filter((r) => r.Room_Status === "OCCUPIED").length,
        totalEmployees: employeesData.length,
        unpaidPayments: unpaidPaymentsData.length,
        pendingRepairs: pendingRepairsData.length,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        height: "100%",
        backgroundColor: color,
        color: "white",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        }
      }}
      elevation={3}
    >
      <CardContent sx={{ py: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography
              sx={{
                opacity: 0.9,
                fontSize: "0.875rem",
                fontWeight: 500,
                mb: 1
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: 70,
              height: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 35 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <Typography variant="h5">กำลังโหลดข้อมูล...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📊 Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ภาพรวมระบบจัดการหอพัก - อัพเดทแบบเรียลไทม์
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="ลูกค้าทั้งหมด"
            value={stats.totalCustomers}
            icon={<PeopleIcon />}
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="ห้องทั้งหมด"
            value={stats.totalRooms}
            icon={<MeetingRoomIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="ห้องว่าง"
            value={stats.availableRooms}
            icon={<MeetingRoomIcon />}
            color="#f093fb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="ห้องที่มีผู้เช่า"
            value={stats.occupiedRooms}
            icon={<MeetingRoomIcon />}
            color="#4facfe"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="พนักงานทั้งหมด"
            value={stats.totalEmployees}
            icon={<WorkIcon />}
            color="#a8edea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="บิลยังไม่จ่าย"
            value={stats.unpaidPayments}
            icon={<PaymentIcon />}
            color="#ff9a9e"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="รอซ่อม"
            value={stats.pendingRepairs}
            icon={<WarningIcon />}
            color="#ffecd2"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 4,
                backgroundColor: "#667eea",
                color: "white",
                borderRadius: 3,
              }}
              elevation={3}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                🏢 ยินดีต้อนรับสู่ระบบจัดการหอพัก
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mt: 2 }}>
                ระบบจัดการหอพักครบวงจร พร้อมฟีเจอร์การจัดการลูกค้า ห้องพัก การชำระเงิน
                และการแจ้งซ่อม เลือกเมนูด้านซ้ายเพื่อเริ่มต้นการใช้งาน
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "#f093fb",
                color: "white",
              }}
              elevation={3}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                ⚡ สถิติด่วน
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  • อัตราการเข้าพัก: {stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}%
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  • บิลค้างชำระ: {stats.unpaidPayments} รายการ
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  • งานซ่อมรอดำเนินการ: {stats.pendingRepairs} งาน
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}