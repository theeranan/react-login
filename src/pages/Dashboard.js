// Import React hooks สำหรับจัดการ state และ lifecycle
import React, { useEffect, useState } from "react";
// Import Material-UI components สำหรับสร้าง UI
import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
// Import icons จาก Material-UI
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PaymentIcon from "@mui/icons-material/Payment";
import BuildIcon from "@mui/icons-material/Build";
import WorkIcon from "@mui/icons-material/Work";
import WarningIcon from "@mui/icons-material/Warning";
// Import services สำหรับดึงข้อมูลจาก API
import customerService from "../services/customerService";
import roomService from "../services/roomService";
import paymentService from "../services/paymentService";
import repairService from "../services/repairService";
import employeeService from "../services/employeeService";

// Component หลักของหน้า Dashboard
export default function Dashboard() {
  // สร้าง state สำหรับเก็บสถิติต่างๆ ของระบบ
  const [stats, setStats] = useState({
    totalCustomers: 0, // จำนวนลูกค้าทั้งหมด
    totalRooms: 0, // จำนวนห้องทั้งหมด
    availableRooms: 0, // จำนวนห้องว่าง
    occupiedRooms: 0, // จำนวนห้องที่มีผู้เช่า
    totalEmployees: 0, // จำนวนพนักงานทั้งหมด
    unpaidPayments: 0, // จำนวนบิลที่ยังไม่จ่าย
    pendingRepairs: 0, // จำนวนงานซ่อมที่รอดำเนินการ
  });
  // สร้าง state สำหรับสถานะการโหลดข้อมูล
  const [loading, setLoading] = useState(true);

  // useEffect hook ที่จะทำงานเมื่อ component โหลดครั้งแรก
  useEffect(() => {
    loadDashboardData(); // เรียกฟังก์ชันโหลดข้อมูล
  }, []); // [] หมายถึงทำงานเพียงครั้งเดียวตอนโหลด component

  // ฟังก์ชัน async สำหรับโหลดข้อมูลทั้งหมดของ Dashboard
  const loadDashboardData = async () => {
    try {
      // ใช้ Promise.all เพื่อเรียก API หลายตัวพร้อมกัน (parallel) เพื่อประสิทธิภาพที่ดีขึ้น
      const [
        customersData, // ข้อมูลลูกค้าที่ active
        roomsData, // ข้อมูลห้องทั้งหมด
        availableRoomsData, // ข้อมูลห้องว่าง
        employeesData, // ข้อมูลพนักงานที่ active
        unpaidPaymentsData, // ข้อมูลบิลที่ยังไม่จ่าย
        pendingRepairsData, // ข้อมูลงานซ่อมที่รอดำเนินการ
      ] = await Promise.all([
        customerService.getActive(), // เรียกดูลูกค้าที่ active
        roomService.getAll(), // เรียกดูห้องทั้งหมด
        roomService.getAvailable(), // เรียกดูห้องว่าง
        employeeService.getActive(), // เรียกดูพนักงานที่ active
        paymentService.getUnpaid(), // เรียกดูบิลที่ยังไม่จ่าย
        repairService.getPending(), // เรียกดูงานซ่อมที่รอดำเนินการ
      ]);

      // อัพเดท state stats ด้วยข้อมูลที่ได้รับ
      setStats({
        totalCustomers: customersData.length, // นับจำนวนลูกค้า
        totalRooms: roomsData.length, // นับจำนวนห้องทั้งหมด
        availableRooms: availableRoomsData.length, // นับจำนวนห้องว่าง
        occupiedRooms: roomsData.filter((r) => r.Room_Status === "OCCUPIED")
          .length, // กรองและนับห้องที่มีสถานะ OCCUPIED
        totalEmployees: employeesData.length, // นับจำนวนพนักงาน
        unpaidPayments: unpaidPaymentsData.length, // นับจำนวนบิลที่ยังไม่จ่าย
        pendingRepairs: pendingRepairsData.length, // นับจำนวนงานซ่อมที่รอดำเนินการ
      });
    } catch (error) {
      // แสดง error ใน console หากเกิดข้อผิดพลาด
      console.error("Error loading dashboard data:", error);
    } finally {
      // ตั้งค่า loading เป็น false เมื่อโหลดข้อมูลเสร็จ (ไม่ว่าจะสำเร็จหรือเกิด error)
      setLoading(false);
    }
  };

  // Component StatCard สำหรับแสดงการ์ดสถิติแต่ละอัน
  // รับ props: title (ชื่อการ์ด), value (ค่าที่จะแสดง), icon (ไอคอน), color (สี)
  const StatCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        height: "100%", // ให้การ์ดมีความสูงเต็ม
        backgroundColor: color, // ตั้งสีพื้นหลังตาม prop color
        color: "white", // ตั้งสีตัวอักษรเป็นสีขาว
        transition: "all 0.3s ease", // ใส่ transition สำหรับ animation
        "&:hover": {
          // กำหนดสไตล์เมื่อเมาส์ชี้
          transform: "translateY(-5px)", // เลื่อนการ์ดขึ้น 5px
          boxShadow: 6, // เพิ่มเงา
        },
      }}
      elevation={3} // ระดับเงาของการ์ด
    >
      <CardContent sx={{ py: 3 }}>
        {" "}
        {/* กำหนด padding บนล่าง */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {" "}
          {/* จัดเรียงเนื้อหาแบบ flex */}
          <Box>
            {" "}
            {/* Box ด้านซ้ายสำหรับแสดงข้อความ */}
            <Typography
              sx={{
                opacity: 0.9, // ความโปร่งใสของตัวอักษร
                fontSize: "0.875rem", // ขนาดตัวอักษร
                fontWeight: 500, // ความหนาตัวอักษร
                mb: 1, // margin bottom
              }}
            >
              {title} {/* แสดงชื่อการ์ด */}
            </Typography>
            <Typography
              variant="h3" // ขนาด typography แบบ h3
              component="div"
              sx={{ fontWeight: "bold" }} // ตัวหนา
            >
              {value} {/* แสดงค่าสถิติ */}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)", // สีพื้นหลังโปร่งแสง
              borderRadius: "50%", // ทำให้เป็นวงกลม
              width: 70, // กว้าง 70px
              height: 70, // สูง 70px
              display: "flex", // ใช้ flexbox
              alignItems: "center", // จัดกลางแนวตั้ง
              justifyContent: "center", // จัดกลางแนวนอน
              backdropFilter: "blur(10px)", // ใส่เอฟเฟกต์ blur
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 35 } })}{" "}
            {/* แสดงไอคอนและกำหนดขนาดเป็น 35 */}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // แสดงหน้าจอโหลดข้อมูลถ้า loading เป็น true
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        {" "}
        {/* จัดกลางหน้าจอ */}
        <Typography variant="h5">กำลังโหลดข้อมูล...</Typography>{" "}
        {/* แสดงข้อความกำลังโหลด */}
      </Box>
    );
  }

  // แสดงหน้า Dashboard หลัก
  return (
    <Box>
      {/* ส่วนหัวของหน้า Dashboard */}
      <Box sx={{ mb: 4 }}>
        {" "}
        {/* margin bottom 4 */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📊 Dashboard {/* หัวข้อหลัก */}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ภาพรวมระบบจัดการหอพัก - อัพเดทแบบเรียลไทม์ {/* คำอธิบาย */}
        </Typography>
      </Box>

      {/* Grid container สำหรับแสดงการ์ดสถิติต่างๆ */}
      <Grid container spacing={3}>
        {" "}
        {/* ระยะห่างระหว่างการ์ด 3 */}
        {/* การ์ดแสดงจำนวนลูกค้าทั้งหมด */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          {" "}
          {/* responsive: มือถือ full width, tablet ครึ่ง, desktop 1/3, large 1/4 */}
          <StatCard
            title="ลูกค้าทั้งหมด"
            value={stats.totalCustomers}
            icon={<PeopleIcon />}
            color="#667eea"
          />
        </Grid>
        {/* การ์ดแสดงจำนวนห้องทั้งหมด */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="ห้องทั้งหมด"
            value={stats.totalRooms}
            icon={<MeetingRoomIcon />}
            color="#2e7d32"
          />
        </Grid>
        {/* การ์ดแสดงจำนวนห้องว่าง */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="ห้องว่าง"
            value={stats.availableRooms}
            icon={<MeetingRoomIcon />}
            color="#f093fb"
          />
        </Grid>
        {/* การ์ดแสดงจำนวนห้องที่มีผู้เช่า */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="ห้องที่มีผู้เช่า"
            value={stats.occupiedRooms}
            icon={<MeetingRoomIcon />}
            color="#4facfe"
          />
        </Grid>
        {/* การ์ดแสดงจำนวนพนักงานทั้งหมด */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="พนักงานทั้งหมด"
            value={stats.totalEmployees}
            icon={<WorkIcon />}
            color="#a8edea"
          />
        </Grid>
        {/* การ์ดแสดงจำนวนบิลยังไม่จ่าย */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="บิลยังไม่จ่าย"
            value={stats.unpaidPayments}
            icon={<PaymentIcon />}
            color="#ff9a9e"
          />
        </Grid>
        {/* การ์ดแสดงจำนวนงานซ่อมที่รอดำเนินการ */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard
            title="รอซ่อม"
            value={stats.pendingRepairs}
            icon={<WarningIcon />}
            color="#ffecd2"
          />
        </Grid>
      </Grid>

      {/* ส่วนแสดงข้อมูลเพิ่มเติมด้านล่าง */}
      <Box sx={{ mt: 5 }}>
        {" "}
        {/* margin top 5 */}
        <Grid container spacing={3}>
          {/* Panel ด้านซ้าย: ข้อความต้อนรับ */}
          <Grid item xs={12} md={8}>
            {" "}
            {/* มือถือ full width, desktop 2/3 */}
            <Paper
              sx={{
                p: 4, // padding 4
                backgroundColor: "#667eea", // สีม่วงน้ำเงิน
                color: "white", // ตัวอักษรสีขาว
                borderRadius: 3, // มุมโค้ง
              }}
              elevation={3} // ระดับเงา
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                🏢 ยินดีต้อนรับสู่ระบบจัดการหอพัก {/* หัวข้อ */}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mt: 2 }}>
                {" "}
                {/* ความโปร่งใส 0.9, margin top 2 */}
                ระบบจัดการหอพักครบวงจร พร้อมฟีเจอร์การจัดการลูกค้า ห้องพัก
                การชำระเงิน และการแจ้งซ่อม
                เลือกเมนูด้านซ้ายเพื่อเริ่มต้นการใช้งาน {/* ข้อความอธิบาย */}
              </Typography>
            </Paper>
          </Grid>
          {/* Panel ด้านขวา: สถิติด่วน */}
          <Grid item xs={12} md={4}>
            {" "}
            {/* มือถือ full width, desktop 1/3 */}
            <Paper
              sx={{
                p: 4, // padding 4
                borderRadius: 3, // มุมโค้ง
                backgroundColor: "#f093fb", // สีชมพู
                color: "white", // ตัวอักษรสีขาว
              }}
              elevation={3} // ระดับเงา
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                ⚡ สถิติด่วน {/* หัวข้อ */}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {" "}
                {/* margin top 2 */}
                {/* คำนวณและแสดงอัตราการเข้าพัก เป็นเปอร์เซ็นต์ */}
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  • อัตราการเข้าพัก:{" "}
                  {stats.totalRooms > 0
                    ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100)
                    : 0}
                  %
                </Typography>
                {/* แสดงจำนวนบิลค้างชำระ */}
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                  • บิลค้างชำระ: {stats.unpaidPayments} รายการ
                </Typography>
                {/* แสดงจำนวนงานซ่อมรอดำเนินการ */}
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
