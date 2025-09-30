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
import EditIcon from "@mui/icons-material/Edit";       // ไอคอนแก้ไข
import DeleteIcon from "@mui/icons-material/Delete";   // ไอคอนลบ
import AddIcon from "@mui/icons-material/Add";         // ไอคอนเพิ่ม

// นำเข้า service สำหรับเรียก API
import employeeService from "../services/employeeService"; // service จัดการข้อมูลพนักงาน

// นำเข้า SweetAlert2 สำหรับแสดงข้อความแจ้งเตือนแบบสวยงาม
import Swal from "sweetalert2";

// Array เก็บตำแหน่งงานที่มีให้เลือก
const positions = ["แม่บ้าน", "รปภ.", "ช่างซ่อม", "พนักงานทั่วไป"];

export default function Employees() {
  // State เก็บรายการพนักงานทั้งหมด
  const [employees, setEmployees] = useState([]);

  // State สถานะการโหลดข้อมูล
  const [loading, setLoading] = useState(true);

  // State เปิด/ปิด Dialog ฟอร์ม
  const [openDialog, setOpenDialog] = useState(false);

  // State บอกว่าอยู่ในโหมดแก้ไขหรือสร้างใหม่
  const [editMode, setEditMode] = useState(false);

  // State เก็บข้อมูลพนักงานที่กำลังทำงานอยู่ (แก้ไขหรือสร้างใหม่)
  const [currentEmployee, setCurrentEmployee] = useState({
    Emp_ID: "",                                      // รหัสพนักงาน
    Emp_Name: "",                                    // ชื่อ
    Emp_Lastname: "",                                // นามสกุล
    Emp_Tel: "",                                     // เบอร์โทร
    Emp_Address: "",                                 // ที่อยู่
    Emp_Salary: 0,                                   // เงินเดือน
    Emp_Position: "พนักงานทั่วไป",                   // ตำแหน่ง (เริ่มต้นเป็นพนักงานทั่วไป)
    Emp_Status: "active",                            // สถานะ (เริ่มต้นทำงานอยู่)
    DateHired: new Date().toISOString().split("T")[0], // วันที่เริ่มงาน (วันนี้)
  });

  // useEffect จะทำงานครั้งเดียวตอนเริ่มต้น (โหลดข้อมูล)
  useEffect(() => {
    loadEmployees(); // โหลดรายการพนักงาน
  }, []);

  // ฟังก์ชันโหลดข้อมูลพนักงานทั้งหมดจาก API
  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAll(); // เรียก API ดึงข้อมูล
      setEmployees(data);                           // เก็บข้อมูลลง state
    } catch (error) {
      console.error("Error loading employees:", error);
      Swal.fire("ข้อผิดพลาด!", "ไม่สามารถโหลดข้อมูลพนักงานได้", "error");
    } finally {
      setLoading(false); // ปิดสถานะ loading
    }
  };

  // ฟังก์ชันเปิด Dialog (กล่องป๊อปอัพ)
  const handleOpenDialog = (employee = null) => {
    if (employee) {
      // ถ้ามีข้อมูล employee ส่งเข้ามา = โหมดแก้ไข
      setEditMode(true);
      setCurrentEmployee({
        ...employee,
        // แปลง Date object เป็น string format yyyy-mm-dd
        DateHired: employee.DateHired
          ? new Date(employee.DateHired).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      // ถ้าไม่มีข้อมูล = โหมดสร้างใหม่
      setEditMode(false);
      setCurrentEmployee({
        Emp_ID: "",
        Emp_Name: "",
        Emp_Lastname: "",
        Emp_Tel: "",
        Emp_Address: "",
        Emp_Salary: 0,
        Emp_Position: "พนักงานทั่วไป",
        Emp_Status: "active",
        DateHired: new Date().toISOString().split("T")[0],
      });
    }
    setOpenDialog(true); // เปิด Dialog
  };

  // ฟังก์ชันปิด Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // ฟังก์ชันจัดการเมื่อมีการเปลี่ยนแปลงค่าในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee((prev) => ({ ...prev, [name]: value })); // อัปเดต state
  };

  // ฟังก์ชันบันทึกข้อมูล (สร้างใหม่หรือแก้ไข)
  const handleSubmit = async () => {
    try {
      if (editMode) {
        // ถ้าโหมดแก้ไข เรียก API update
        await employeeService.update(currentEmployee.Emp_ID, currentEmployee);
        Swal.fire("สำเร็จ!", "แก้ไขข้อมูลพนักงานสำเร็จ", "success");
      } else {
        // ถ้าโหมดสร้างใหม่ เรียก API create
        await employeeService.create(currentEmployee);
        Swal.fire("สำเร็จ!", "เพิ่มพนักงานสำเร็จ", "success");
      }
      handleCloseDialog(); // ปิด Dialog
      loadEmployees();     // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error saving employee:", error);
      Swal.fire(
        "ข้อผิดพลาด!",
        error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
        "error"
      );
    }
  };

  // ฟังก์ชันลบพนักงาน
  const handleDelete = async (empId) => {
    // แสดง popup ยืนยันก่อนลบ
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบพนักงานคนนี้หรือไม่?",
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
        await employeeService.delete(empId); // เรียก API ลบ
        Swal.fire("สำเร็จ!", "ลบพนักงานสำเร็จ", "success");
        loadEmployees(); // โหลดข้อมูลใหม่
      } catch (error) {
        console.error("Error deleting employee:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถลบพนักงานได้", "error");
      }
    }
  };

  // ฟังก์ชันกำหนดสีของ Chip ตามสถานะ
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success"; // เขียว - ทำงานอยู่
      case "inactive":
        return "error";   // แดง - ลาออก
      default:
        return "default";
    }
  };

  // ฟังก์ชันแปลงสถานะเป็นภาษาไทย
  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "ทำงานอยู่";
      case "inactive":
        return "ลาออก";
      default:
        return status;
    }
  };

  // ถ้ายังโหลดข้อมูลอยู่ แสดงข้อความ Loading
  if (loading) {
    return <Typography>กำลังโหลดข้อมูล...</Typography>;
  }

  // แสดง UI หลัก
  return (
    <Box>
      {/* ส่วนหัวของหน้า มีชื่อหน้าและปุ่มเพิ่มพนักงาน */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">จัดการพนักงาน</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()} // คลิกแล้วเปิด Dialog โหมดสร้างใหม่
        >
          เพิ่มพนักงาน
        </Button>
      </Box>

      {/* ตารางแสดงรายการพนักงาน */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* หัวตารางแต่ละคอลัมน์ */}
              <TableCell>รหัสพนักงาน</TableCell>
              <TableCell>ชื่อ-นามสกุล</TableCell>
              <TableCell>ตำแหน่ง</TableCell>
              <TableCell>เบอร์โทร</TableCell>
              <TableCell>เงินเดือน</TableCell>
              <TableCell>วันที่เริ่มงาน</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell align="center">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* วนลูปแสดงข้อมูลพนักงานแต่ละคน */}
            {employees.map((employee) => (
              <TableRow key={employee.Emp_ID}>
                <TableCell>{employee.Emp_ID}</TableCell>
                <TableCell>
                  {/* แสดงชื่อ-นามสกุล */}
                  {employee.Emp_Name} {employee.Emp_Lastname}
                </TableCell>
                <TableCell>{employee.Emp_Position}</TableCell>
                <TableCell>{employee.Emp_Tel}</TableCell>
                <TableCell>{employee.Emp_Salary?.toLocaleString()} บาท</TableCell>
                <TableCell>
                  {/* แปลงวันที่เป็นรูปแบบไทย */}
                  {employee.DateHired
                    ? new Date(employee.DateHired).toLocaleDateString("th-TH")
                    : "-"}
                </TableCell>
                <TableCell>
                  {/* แสดง Chip สถานะ */}
                  <Chip
                    label={getStatusLabel(employee.Emp_Status)}
                    color={getStatusColor(employee.Emp_Status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {/* ปุ่มแก้ไข */}
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(employee)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  {/* ปุ่มลบ */}
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(employee.Emp_ID)}
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

      {/* Dialog ฟอร์มสร้าง/แก้ไขพนักงาน */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        {/* หัวข้อของ Dialog */}
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {editMode ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่"}
        </DialogTitle>

        {/* เนื้อหาในฟอร์ม */}
        <DialogContent sx={{ mt: 3 }}>
          {/* ส่วนที่ 1: ข้อมูลพื้นฐาน */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ข้อมูลพื้นฐาน
            </Typography>
            <Grid container spacing={3}>
              {/* รหัสพนักงาน */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="รหัสพนักงาน"
                  name="Emp_ID"
                  value={currentEmployee.Emp_ID}
                  onChange={handleChange}
                  disabled={editMode} // ห้ามแก้ไขเมื่ออยู่ในโหมดแก้ไข
                  required
                />
              </Grid>
              {/* ชื่อ */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="ชื่อ"
                  name="Emp_Name"
                  value={currentEmployee.Emp_Name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              {/* นามสกุล */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="นามสกุล"
                  name="Emp_Lastname"
                  value={currentEmployee.Emp_Lastname}
                  onChange={handleChange}
                  required
                />
              </Grid>
              {/* เบอร์โทร */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="เบอร์โทร"
                  name="Emp_Tel"
                  value={currentEmployee.Emp_Tel}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* ส่วนที่ 2: ข้อมูลการทำงาน */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ข้อมูลการทำงาน
            </Typography>
            <Grid container spacing={3}>
              {/* เลือกตำแหน่ง */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="ตำแหน่ง"
                  name="Emp_Position"
                  value={currentEmployee.Emp_Position}
                  onChange={handleChange}
                  required
                >
                  {/* แสดงรายการตำแหน่งให้เลือก */}
                  {positions.map((position) => (
                    <MenuItem key={position} value={position}>
                      {position}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* เงินเดือน */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="เงินเดือน (บาท)"
                  name="Emp_Salary"
                  value={currentEmployee.Emp_Salary}
                  onChange={handleChange}
                  required
                />
              </Grid>
              {/* วันที่เริ่มงาน */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="วันที่เริ่มงาน"
                  name="DateHired"
                  value={currentEmployee.DateHired}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* ส่วนที่ 3: ที่อยู่และสถานะ */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ที่อยู่และสถานะ
            </Typography>
            <Grid container spacing={3}>
              {/* ที่อยู่ */}
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="ที่อยู่"
                  name="Emp_Address"
                  value={currentEmployee.Emp_Address}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              {/* สถานะ */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="สถานะ"
                  name="Emp_Status"
                  value={currentEmployee.Emp_Status}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="active">ทำงานอยู่</MenuItem>
                  <MenuItem value="inactive">ลาออก</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        {/* ส่วนปุ่มด้านล่างของ Dialog */}
        <DialogActions>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? "บันทึก" : "เพิ่ม"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
