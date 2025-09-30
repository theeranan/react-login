// นำเข้า React และ hooks ที่จำเป็น
import React, { useEffect, useState } from "react";

// นำเข้า components จาก Material-UI สำหรับสร้าง UI
import {
  Box,              // กล่องสำหรับจัด layout
  Button,           // ปุ่มกด
  Paper,            // กระดาษพื้นหลังสีขาว มีเงา
  Table,            // ตาราง
  TableBody,        // ส่วนเนื้อหาของตาราง
  TableCell,        // เซลล์ในตาราง
  TableContainer,   // คอนเทนเนอร์ของตาราง
  TableHead,        // ส่วนหัวของตาราง
  TableRow,         // แถวในตาราง
  Typography,       // ข้อความ
  IconButton,       // ปุ่มไอคอน
  Chip,             // ชิปแสดงสถานะ
  Dialog,           // กล่องป๊อปอัพ
  DialogTitle,      // หัวข้อของกล่องป๊อปอัพ
  DialogContent,    // เนื้อหาในกล่องป๊อปอัพ
  DialogActions,    // ส่วนปุ่มด้านล่างของกล่องป๊อปอัพ
  TextField,        // ช่องกรอกข้อมูล
  Grid,             // ระบบ Grid สำหรับจัดวาง
  MenuItem,         // รายการใน dropdown
} from "@mui/material";

// นำเข้าไอคอนต่างๆ จาก Material-UI
import EditIcon from "@mui/icons-material/Edit";     // ไอคอนแก้ไข
import DeleteIcon from "@mui/icons-material/Delete"; // ไอคอนลบ

// นำเข้า service สำหรับเรียก API
import userService from "../services/userService"; // service จัดการข้อมูลผู้ใช้

// นำเข้า SweetAlert2 สำหรับแสดงข้อความแจ้งเตือนแบบสวยงาม
import Swal from "sweetalert2";

export default function Users() {
  // State เก็บรายการผู้ใช้ทั้งหมด
  const [users, setUsers] = useState([]);

  // State สถานะการโหลดข้อมูล
  const [loading, setLoading] = useState(true);

  // State เปิด/ปิด Dialog ฟอร์ม
  const [openDialog, setOpenDialog] = useState(false);

  // State เก็บข้อมูลผู้ใช้ที่กำลังแก้ไข
  const [currentUser, setCurrentUser] = useState({
    id: null,           // รหัสผู้ใช้
    email: "",          // อีเมล
    role: "USER",       // บทบาท (เริ่มต้นเป็นผู้ใช้ทั่วไป)
  });

  // useEffect จะทำงานครั้งเดียวตอนเริ่มต้น (โหลดข้อมูล)
  useEffect(() => {
    loadUsers(); // โหลดรายการผู้ใช้
  }, []);

  // ฟังก์ชันโหลดข้อมูลผู้ใช้ทั้งหมดจาก API
  const loadUsers = async () => {
    try {
      const data = await userService.getAll(); // เรียก API ดึงข้อมูล
      setUsers(data);                           // เก็บข้อมูลลง state
    } catch (error) {
      console.error("Error loading users:", error);
      Swal.fire("ข้อผิดพลาด!", "ไม่สามารถโหลดข้อมูลผู้ใช้ได้", "error");
    } finally {
      setLoading(false); // ปิดสถานะ loading
    }
  };

  // ฟังก์ชันเปิด Dialog สำหรับแก้ไขบทบาทผู้ใช้
  const handleOpenDialog = (user) => {
    setCurrentUser({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    setOpenDialog(true); // เปิด Dialog
  };

  // ฟังก์ชันปิด Dialog และรีเซ็ตข้อมูล
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser({
      id: null,
      email: "",
      role: "USER",
    });
  };

  // ฟังก์ชันจัดการเมื่อมีการเปลี่ยนแปลงค่าในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value })); // อัปเดต state
  };

  // ฟังก์ชันบันทึกการแก้ไขบทบาทผู้ใช้
  const handleSubmit = async () => {
    try {
      // เรียก API update เฉพาะบทบาท
      await userService.update(currentUser.id, { role: currentUser.role });
      Swal.fire("สำเร็จ!", "แก้ไขข้อมูลผู้ใช้สำเร็จ", "success");
      handleCloseDialog(); // ปิด Dialog
      loadUsers();         // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error saving user:", error);
      Swal.fire(
        "ข้อผิดพลาด!",
        error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
        "error"
      );
    }
  };

  // ฟังก์ชันลบผู้ใช้
  const handleDelete = async (userId, userEmail) => {
    // แสดง popup ยืนยันก่อนลบ
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: `คุณต้องการลบผู้ใช้ ${userEmail} หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      // ถ้ายืนยันการลบ
      try {
        await userService.delete(userId); // เรียก API ลบ
        Swal.fire("สำเร็จ!", "ลบผู้ใช้สำเร็จ", "success");
        loadUsers(); // โหลดข้อมูลใหม่
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถลบผู้ใช้ได้", "error");
      }
    }
  };

  // ฟังก์ชันกำหนดสีของ Chip ตามบทบาท
  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "error";   // แดง - ผู้ดูแลระบบ
      case "EMPLOYEE":
        return "warning"; // เหลือง - พนักงาน
      case "USER":
        return "info";    // ฟ้า - ผู้ใช้ทั่วไป
      default:
        return "default";
    }
  };

  // ฟังก์ชันแปลงบทบาทเป็นภาษาไทย
  const getRoleLabel = (role) => {
    switch (role) {
      case "ADMIN":
        return "ผู้ดูแลระบบ";
      case "EMPLOYEE":
        return "พนักงาน";
      case "USER":
        return "ผู้ใช้ทั่วไป";
      default:
        return role;
    }
  };

  // ถ้ายังโหลดข้อมูลอยู่ แสดงข้อความ Loading
  if (loading) {
    return <Typography>กำลังโหลดข้อมูล...</Typography>;
  }

  // แสดง UI หลัก
  return (
    <Box>
      {/* ส่วนหัวของหน้า */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">จัดการผู้ใช้งานระบบ</Typography>
      </Box>

      {/* ตารางแสดงรายการผู้ใช้ */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* หัวตารางแต่ละคอลัมน์ */}
              <TableCell>ID</TableCell>
              <TableCell>อีเมล</TableCell>
              <TableCell>บทบาท</TableCell>
              <TableCell>วันที่สร้าง</TableCell>
              <TableCell>อัพเดทล่าสุด</TableCell>
              <TableCell align="center">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* วนลูปแสดงข้อมูลผู้ใช้แต่ละคน */}
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {/* แสดง Chip บทบาท */}
                  <Chip
                    label={getRoleLabel(user.role)}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {/* แปลงวันที่เป็นรูปแบบไทย */}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("th-TH")
                    : "-"}
                </TableCell>
                <TableCell>
                  {/* แปลงวันที่เป็นรูปแบบไทย */}
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString("th-TH")
                    : "-"}
                </TableCell>
                <TableCell align="center">
                  {/* ปุ่มแก้ไข (แก้ไขได้เฉพาะบทบาท) */}
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(user)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  {/* ปุ่มลบ */}
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(user.id, user.email)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog ฟอร์มแก้ไขบทบาทผู้ใช้ */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {/* หัวข้อของ Dialog */}
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          แก้ไขข้อมูลผู้ใช้
        </DialogTitle>

        {/* เนื้อหาในฟอร์ม */}
        <DialogContent sx={{ mt: 3 }}>
          {/* ส่วนที่ 1: ข้อมูลผู้ใช้ */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ข้อมูลผู้ใช้
            </Typography>
            <Grid container spacing={3}>
              {/* อีเมล (ไม่สามารถแก้ไขได้) */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="อีเมล"
                  name="email"
                  value={currentUser.email}
                  InputProps={{ readOnly: true }} // ไม่ให้แก้ไข
                  disabled
                />
              </Grid>
            </Grid>
          </Box>

          {/* ส่วนที่ 2: บทบาทและสิทธิ์ */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              บทบาทและสิทธิ์
            </Typography>
            <Grid container spacing={3}>
              {/* เลือกบทบาท */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="บทบาท"
                  name="role"
                  value={currentUser.role}
                  onChange={handleChange}
                  required
                >
                  {/* รายการบทบาทให้เลือก */}
                  <MenuItem value="USER">ผู้ใช้ทั่วไป</MenuItem>
                  <MenuItem value="EMPLOYEE">พนักงาน</MenuItem>
                  <MenuItem value="ADMIN">ผู้ดูแลระบบ</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        {/* ส่วนปุ่มด้านล่างของ Dialog */}
        <DialogActions>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button onClick={handleSubmit} variant="contained">
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
