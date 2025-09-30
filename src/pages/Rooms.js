// นำเข้า React และ hooks ที่จำเป็น
import React, { useEffect, useState } from "react";

// นำเข้า components จาก Material-UI สำหรับสร้าง UI
import {
  Box,              // กล่องสำหรับจัด layout
  Button,           // ปุ่มกด
  Paper,            // กระดาษพื้นหลังสีขาว มีเงา
  Table,            // ตาราง
  TableBody,        // ส่วนเนื้อหาตาราง
  TableCell,        // เซลล์ในตาราง
  TableContainer,   // คอนเทนเนอร์หุ้มตาราง
  TableHead,        // ส่วนหัวตาราง
  TableRow,         // แถวในตาราง
  Typography,       // ข้อความ
  IconButton,       // ปุ่มไอคอน
  Chip,            // แท็กแสดงสถานะ
  Dialog,          // หน้าต่าง popup
  DialogTitle,     // หัวข้อ dialog
  DialogContent,   // เนื้อหา dialog
  DialogActions,   // ส่วนปุ่มใน dialog
  TextField,       // ช่องกรอกข้อมูล
  Grid,           // ระบบ grid layout
  MenuItem,       // รายการใน dropdown
  Divider,        // เส้นแบ่ง
} from "@mui/material";

// นำเข้าไอคอนจาก Material-UI
import EditIcon from "@mui/icons-material/Edit";     // ไอคอนแก้ไข
import DeleteIcon from "@mui/icons-material/Delete"; // ไอคอนลบ
import AddIcon from "@mui/icons-material/Add";       // ไอคอนเพิ่ม

// นำเข้า service สำหรับติดต่อ API
import roomService from "../services/roomService";

// นำเข้า SweetAlert2 สำหรับแสดง popup แจ้งเตือน
import Swal from "sweetalert2";

// กำหนดประเภทห้องที่มีให้เลือก
const roomTypes = ["มาตรฐาน", "ดีลักซ์", "VIP"];

// กำหนดสถานะห้องพร้อมสีที่แสดง
const roomStatuses = [
  { value: "AVAILABLE", label: "ว่าง", color: "success" },        // เขียว - ห้องว่าง
  { value: "OCCUPIED", label: "มีผู้เช่า", color: "error" },      // แดง - มีคนเช่าอยู่
  { value: "MAINTENANCE", label: "ซ่อมบำรุง", color: "warning" }, // เหลือง - กำลังซ่อม
  { value: "RESERVED", label: "จองแล้ว", color: "info" },         // ฟ้า - จองไว้แล้ว
];

// สร้าง Component หลักของหน้าจัดการห้องพัก
export default function Rooms() {
  // State เก็บรายการห้องพักทั้งหมด
  const [rooms, setRooms] = useState([]);

  // State บอกสถานะกำลังโหลดข้อมูล
  const [loading, setLoading] = useState(true);

  // State เปิด/ปิด dialog
  const [openDialog, setOpenDialog] = useState(false);

  // State บอกว่ากำลังแก้ไข (true) หรือเพิ่มใหม่ (false)
  const [editMode, setEditMode] = useState(false);

  // State เก็บข้อมูลห้องที่กำลังแก้ไข/เพิ่ม
  const [currentRoom, setCurrentRoom] = useState({
    Room_Number: "",         // เลขห้อง
    Room_Type: "มาตรฐาน",    // ประเภทห้อง (ค่าเริ่มต้น: มาตรฐาน)
    Room_Floor: 1,           // ชั้น
    Room_Size: 0,            // ขนาดห้อง (ตร.ม.)
    Room_Price: 0,           // ค่าเช่า/เดือน
    Room_Deposit: 0,         // เงินประกัน
    Description: "",         // รายละเอียดเพิ่มเติม
  });

  // useEffect จะทำงานตอนโหลดหน้าครั้งแรก
  useEffect(() => {
    loadRooms(); // โหลดข้อมูลห้องพัก
  }, []); // [] หมายถึงทำงานแค่ครั้งเดียวตอนเริ่มต้น

  // ฟังก์ชันโหลดข้อมูลห้องพักจาก API
  const loadRooms = async () => {
    try {
      // เรียก API ดึงข้อมูลห้องทั้งหมด
      const data = await roomService.getAll();
      // เก็บข้อมูลลงใน state
      setRooms(data);
    } catch (error) {
      // ถ้าเกิด error แสดงข้อความผิดพลาด
      console.error("Error loading rooms:", error);
      Swal.fire("ข้อผิดพลาด!", "ไม่สามารถโหลดข้อมูลห้องพักได้", "error");
    } finally {
      // เสร็จแล้วเปลี่ยนสถานะ loading เป็น false
      setLoading(false);
    }
  };

  // ฟังก์ชันเปิด dialog สำหรับเพิ่ม/แก้ไขห้องพัก
  const handleOpenDialog = (room = null) => {
    if (room) {
      // ถ้ามีข้อมูลห้อง = กำลังแก้ไข
      setEditMode(true);
      setCurrentRoom(room);
    } else {
      // ถ้าไม่มีข้อมูล = กำลังเพิ่มใหม่
      setEditMode(false);
      // รีเซ็ตข้อมูลเป็นค่าว่าง
      setCurrentRoom({
        Room_Number: "",
        Room_Type: "มาตรฐาน",
        Room_Floor: 1,
        Room_Size: 0,
        Room_Price: 0,
        Room_Deposit: 0,
        Description: "",
      });
    }
    // เปิด dialog
    setOpenDialog(true);
  };

  // ฟังก์ชันปิด dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // ฟังก์ชันจัดการเมื่อมีการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target; // ดึงชื่อและค่าจาก input
    // อัพเดท state โดยเก็บข้อมูลเดิมและเปลี่ยนแค่ field ที่แก้ไข
    setCurrentRoom((prev) => ({ ...prev, [name]: value }));
  };

  // ฟังก์ชันบันทึกข้อมูล (เพิ่มหรือแก้ไข)
  const handleSubmit = async () => {
    try {
      if (editMode) {
        // ถ้าเป็นโหมดแก้ไข เรียก API update
        await roomService.update(currentRoom.Room_Number, currentRoom);
        Swal.fire("สำเร็จ!", "แก้ไขข้อมูลห้องพักสำเร็จ", "success");
      } else {
        // ถ้าเป็นโหมดเพิ่มใหม่ เรียก API create
        await roomService.create(currentRoom);
        Swal.fire("สำเร็จ!", "เพิ่มห้องพักสำเร็จ", "success");
      }
      // ปิด dialog
      handleCloseDialog();
      // โหลดข้อมูลใหม่เพื่ออัพเดทตาราง
      loadRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      Swal.fire("ข้อผิดพลาด!", error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  // ฟังก์ชันลบห้องพัก
  const handleDelete = async (roomNumber) => {
    // แสดง popup ยืนยันการลบ
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบห้องพักนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    // ถ้ายืนยันการลบ
    if (result.isConfirmed) {
      try {
        // เรียก API ลบห้อง
        await roomService.delete(roomNumber);
        Swal.fire("สำเร็จ!", "ลบห้องพักสำเร็จ", "success");
        // โหลดข้อมูลใหม่
        loadRooms();
      } catch (error) {
        console.error("Error deleting room:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถลบห้องพักได้", "error");
      }
    }
  };

  // ฟังก์ชันสร้าง Chip แสดงสถานะห้อง
  const getStatusChip = (status) => {
    // หาข้อมูลสถานะจาก array roomStatuses
    const statusObj = roomStatuses.find((s) => s.value === status);
    return (
      <Chip
        label={statusObj?.label || status}       // ข้อความที่แสดง
        color={statusObj?.color || "default"}    // สีของ Chip
        size="small"
      />
    );
  };

  // ถ้ายังโหลดข้อมูลอยู่ แสดงข้อความ "กำลังโหลด..."
  if (loading) {
    return <Typography>กำลังโหลดข้อมูล...</Typography>;
  }

  // ส่วนแสดงผล UI
  return (
    <Box>
      {/* ส่วนหัวเรื่องและปุ่มเพิ่มห้องพัก */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">จัดการห้องพัก</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          เพิ่มห้องพัก
        </Button>
      </Box>

      {/* ตารางแสดงรายการห้องพัก */}
      <TableContainer component={Paper}>
        <Table>
          {/* หัวตาราง */}
          <TableHead>
            <TableRow>
              <TableCell>เลขห้อง</TableCell>
              <TableCell>ประเภท</TableCell>
              <TableCell>ชั้น</TableCell>
              <TableCell>ขนาด (ตร.ม.)</TableCell>
              <TableCell>ค่าเช่า/เดือน</TableCell>
              <TableCell>เงินประกัน</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell align="center">จัดการ</TableCell>
            </TableRow>
          </TableHead>

          {/* เนื้อหาตาราง */}
          <TableBody>
            {/* วนลูปแสดงข้อมูลห้องแต่ละห้อง */}
            {rooms.map((room) => (
              <TableRow key={room.Room_Number}>
                <TableCell>{room.Room_Number}</TableCell>
                <TableCell>{room.Room_Type}</TableCell>
                <TableCell>{room.Room_Floor}</TableCell>
                <TableCell>{room.Room_Size}</TableCell>
                {/* แสดงตัวเลขเงินพร้อมคอมม่า */}
                <TableCell>{room.Room_Price.toLocaleString()}</TableCell>
                <TableCell>{room.Room_Deposit.toLocaleString()}</TableCell>
                {/* แสดงสถานะเป็น Chip */}
                <TableCell>{getStatusChip(room.Room_Status)}</TableCell>
                <TableCell align="center">
                  {/* ปุ่มแก้ไข */}
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(room)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  {/* ปุ่มลบ */}
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(room.Room_Number)}
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

      {/* Dialog สำหรับเพิ่ม/แก้ไขห้องพัก */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        {/* หัวข้อ dialog สีน้ำเงิน */}
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {editMode ? "แก้ไขข้อมูลห้องพัก" : "เพิ่มห้องพักใหม่"}
        </DialogTitle>

        {/* เนื้อหา dialog */}
        <DialogContent sx={{ mt: 3 }}>
          {/* Section 1: ข้อมูลห้อง */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}
            >
              ข้อมูลห้อง
            </Typography>
            {/* Grid แบ่งเป็น 4 คอลัมน์ */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="เลขห้อง"
                  name="Room_Number"
                  value={currentRoom.Room_Number}
                  onChange={handleChange}
                  disabled={editMode} // ถ้าแก้ไขจะเปลี่ยนเลขห้องไม่ได้
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                {/* Dropdown เลือกประเภทห้อง */}
                <TextField
                  fullWidth
                  select
                  label="ประเภทห้อง"
                  name="Room_Type"
                  value={currentRoom.Room_Type}
                  onChange={handleChange}
                  required
                >
                  {/* วนลูปแสดงประเภทห้อง */}
                  {roomTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                {/* Input ตัวเลขสำหรับชั้น */}
                <TextField
                  fullWidth
                  type="number"
                  label="ชั้น"
                  name="Room_Floor"
                  value={currentRoom.Room_Floor}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                {/* Input ตัวเลขสำหรับขนาดห้อง */}
                <TextField
                  fullWidth
                  type="number"
                  label="ขนาดห้อง (ตร.ม.)"
                  name="Room_Size"
                  value={currentRoom.Room_Size}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* Section 2: ราคาและค่าใช้จ่าย */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}
            >
              ราคาและค่าใช้จ่าย
            </Typography>
            {/* Grid แบ่งเป็น 2 คอลัมน์ */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {/* Input ตัวเลขสำหรับค่าเช่า */}
                <TextField
                  fullWidth
                  type="number"
                  label="ค่าเช่า/เดือน (บาท)"
                  name="Room_Price"
                  value={currentRoom.Room_Price}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {/* Input ตัวเลขสำหรับเงินประกัน */}
                <TextField
                  fullWidth
                  type="number"
                  label="เงินประกัน (บาท)"
                  name="Room_Deposit"
                  value={currentRoom.Room_Deposit}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* Section 3: รายละเอียดเพิ่มเติม */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}
            >
              รายละเอียดเพิ่มเติม
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {/* Textarea หลายบรรทัด */}
                <TextField
                  fullWidth
                  label="รายละเอียด"
                  name="Description"
                  value={currentRoom.Description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        {/* ส่วนปุ่มด้านล่าง dialog */}
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
