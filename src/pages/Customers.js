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
import EditIcon from "@mui/icons-material/Edit";           // ไอคอนแก้ไข
import DeleteIcon from "@mui/icons-material/Delete";       // ไอคอนลบ
import AddIcon from "@mui/icons-material/Add";             // ไอคอนเพิ่ม
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // ไอคอน check-out

// นำเข้า service สำหรับติดต่อ API
import customerService from "../services/customerService";
import roomService from "../services/roomService";

// นำเข้า SweetAlert2 สำหรับแสดง popup แจ้งเตือน
import Swal from "sweetalert2";

// สร้าง Component หลักของหน้าจัดการลูกค้า
export default function Customers() {
  // State เก็บรายการลูกค้าทั้งหมด
  const [customers, setCustomers] = useState([]);

  // State เก็บรายการห้องว่างที่พร้อมให้เช่า
  const [availableRooms, setAvailableRooms] = useState([]);

  // State บอกสถานะกำลังโหลดข้อมูล
  const [loading, setLoading] = useState(true);

  // State เปิด/ปิด dialog
  const [openDialog, setOpenDialog] = useState(false);

  // State บอกว่ากำลังแก้ไข (true) หรือเพิ่มใหม่ (false)
  const [editMode, setEditMode] = useState(false);

  // State เก็บข้อมูลลูกค้าที่กำลังแก้ไข/เพิ่ม
  const [currentCustomer, setCurrentCustomer] = useState({
    Customer_ID: "",           // รหัสลูกค้า
    Customer_Name: "",         // ชื่อ
    Customer_Lastname: "",     // นามสกุล
    Customer_Tel: "",          // เบอร์โทร
    Customer_Room: "",         // เลขห้อง
    Customer_Car: "",          // ทะเบียนรถ
    Customer_Address: "",      // ที่อยู่
    ContractNo: "",           // เลขที่สัญญา
    DateCheckin: new Date().toISOString().split("T")[0], // วันที่เข้าพัก (วันนี้)
  });

  // useEffect จะทำงานตอนโหลดหน้าครั้งแรก
  useEffect(() => {
    loadCustomers();      // โหลดข้อมูลลูกค้า
    loadAvailableRooms(); // โหลดข้อมูลห้องว่าง
  }, []); // [] หมายถึงทำงานแค่ครั้งเดียวตอนเริ่มต้น

  // ฟังก์ชันโหลดข้อมูลลูกค้าจาก API
  const loadCustomers = async () => {
    try {
      // เรียก API ดึงข้อมูลลูกค้าทั้งหมด
      const data = await customerService.getAll();
      // เก็บข้อมูลลงใน state
      setCustomers(data);
    } catch (error) {
      // ถ้าเกิด error แสดงข้อความผิดพลาด
      console.error("Error loading customers:", error);
      Swal.fire("ข้อผิดพลาด!", "ไม่สามารถโหลดข้อมูลลูกค้าได้", "error");
    } finally {
      // เสร็จแล้วเปลี่ยนสถานะ loading เป็น false
      setLoading(false);
    }
  };

  // ฟังก์ชันโหลดข้อมูลห้องว่างจาก API
  const loadAvailableRooms = async () => {
    try {
      // เรียก API ดึงข้อมูลห้องที่ว่าง
      const data = await roomService.getAvailable();
      // เก็บข้อมูลลงใน state
      setAvailableRooms(data);
    } catch (error) {
      console.error("Error loading available rooms:", error);
    }
  };

  // ฟังก์ชันเปิด dialog สำหรับเพิ่ม/แก้ไขลูกค้า
  const handleOpenDialog = (customer = null) => {
    if (customer) {
      // ถ้ามีข้อมูลลูกค้า = กำลังแก้ไข
      setEditMode(true);
      // แปลงวันที่เป็นรูปแบบ YYYY-MM-DD สำหรับ input type="date"
      setCurrentCustomer({
        ...customer,
        DateCheckin: new Date(customer.DateCheckin).toISOString().split("T")[0],
      });
    } else {
      // ถ้าไม่มีข้อมูล = กำลังเพิ่มใหม่
      setEditMode(false);
      // รีเซ็ตข้อมูลเป็นค่าว่าง
      setCurrentCustomer({
        Customer_ID: "",
        Customer_Name: "",
        Customer_Lastname: "",
        Customer_Tel: "",
        Customer_Room: "",
        Customer_Car: "",
        Customer_Address: "",
        ContractNo: "",
        DateCheckin: new Date().toISOString().split("T")[0],
      });
    }
    // เปิด dialog
    setOpenDialog(true);
  };

  // ฟังก์ชันปิด dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    // รีเซ็ตข้อมูลเป็นค่าว่าง
    setCurrentCustomer({
      Customer_ID: "",
      Customer_Name: "",
      Customer_Lastname: "",
      Customer_Tel: "",
      Customer_Room: "",
      Customer_Car: "",
      Customer_Address: "",
      ContractNo: "",
      DateCheckin: new Date().toISOString().split("T")[0],
    });
  };

  // ฟังก์ชันจัดการเมื่อมีการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target; // ดึงชื่อและค่าจาก input
    // อัพเดท state โดยเก็บข้อมูลเดิมและเปลี่ยนแค่ field ที่แก้ไข
    setCurrentCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // ฟังก์ชันบันทึกข้อมูล (เพิ่มหรือแก้ไข)
  const handleSubmit = async () => {
    try {
      if (editMode) {
        // ถ้าเป็นโหมดแก้ไข เรียก API update
        await customerService.update(currentCustomer.Customer_ID, currentCustomer);
        Swal.fire("สำเร็จ!", "แก้ไขข้อมูลลูกค้าสำเร็จ", "success");
      } else {
        // ถ้าเป็นโหมดเพิ่มใหม่ เรียก API create
        await customerService.create(currentCustomer);
        Swal.fire("สำเร็จ!", "เพิ่มลูกค้าสำเร็จ", "success");
      }
      // ปิด dialog
      handleCloseDialog();
      // โหลดข้อมูลใหม่เพื่ออัพเดทตาราง
      loadCustomers();
      loadAvailableRooms();
    } catch (error) {
      console.error("Error saving customer:", error);
      Swal.fire("ข้อผิดพลาด!", error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  // ฟังก์ชันลบลูกค้า
  const handleDelete = async (customerId) => {
    // แสดง popup ยืนยันการลบ
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบลูกค้าคนนี้หรือไม่?",
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
        // เรียก API ลบลูกค้า
        await customerService.delete(customerId);
        Swal.fire("สำเร็จ!", "ลบลูกค้าสำเร็จ", "success");
        // โหลดข้อมูลใหม่
        loadCustomers();
        loadAvailableRooms();
      } catch (error) {
        console.error("Error deleting customer:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถลบลูกค้าได้", "error");
      }
    }
  };

  // ฟังก์ชันให้ลูกค้า check-out (ออกจากหอพัก)
  const handleCheckout = async (customerId) => {
    // แสดง popup ยืนยัน check-out
    const result = await Swal.fire({
      title: "ยืนยัน Check-out?",
      text: "คุณต้องการให้ลูกค้าคนนี้ออกจากหอพักหรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, Check-out",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        // เรียก API checkout พร้อมวันที่ปัจจุบัน
        await customerService.checkout(customerId, new Date());
        Swal.fire("สำเร็จ!", "Check-out สำเร็จ", "success");
        // โหลดข้อมูลใหม่
        loadCustomers();
        loadAvailableRooms();
      } catch (error) {
        console.error("Error checkout customer:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถ Check-out ได้", "error");
      }
    }
  };

  // ฟังก์ชันกำหนดสีของ Chip ตามสถานะ
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";      // เขียว - กำลังพัก
      case "inactive":
        return "warning";      // เหลือง - ไม่ได้ใช้งาน
      case "moved_out":
        return "error";        // แดง - ออกไปแล้ว
      default:
        return "default";      // เทา - ค่าเริ่มต้น
    }
  };

  // ถ้ายังโหลดข้อมูลอยู่ แสดงข้อความ "กำลังโหลด..."
  if (loading) {
    return <Typography>กำลังโหลดข้อมูล...</Typography>;
  }

  // ส่วนแสดงผล UI
  return (
    <Box>
      {/* ส่วนหัวเรื่องและปุ่มเพิ่มลูกค้า */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">จัดการลูกค้า</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          เพิ่มลูกค้า
        </Button>
      </Box>

      {/* ตารางแสดงรายการลูกค้า */}
      <TableContainer component={Paper}>
        <Table>
          {/* หัวตาราง */}
          <TableHead>
            <TableRow>
              <TableCell>รหัสลูกค้า</TableCell>
              <TableCell>ชื่อ-นามสกุล</TableCell>
              <TableCell>เบอร์โทร</TableCell>
              <TableCell>ห้อง</TableCell>
              <TableCell>สัญญา</TableCell>
              <TableCell>วันเข้าพัก</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell align="center">จัดการ</TableCell>
            </TableRow>
          </TableHead>

          {/* เนื้อหาตาราง */}
          <TableBody>
            {/* วนลูปแสดงข้อมูลลูกค้าแต่ละคน */}
            {customers.map((customer) => (
              <TableRow key={customer.Customer_ID}>
                <TableCell>{customer.Customer_ID}</TableCell>
                <TableCell>
                  {customer.Customer_Name} {customer.Customer_Lastname}
                </TableCell>
                <TableCell>{customer.Customer_Tel}</TableCell>
                <TableCell>{customer.Customer_Room}</TableCell>
                <TableCell>{customer.ContractNo}</TableCell>
                <TableCell>
                  {/* แปลงวันที่เป็นภาษาไทย */}
                  {new Date(customer.DateCheckin).toLocaleDateString("th-TH")}
                </TableCell>
                <TableCell>
                  {/* แสดงสถานะเป็น Chip */}
                  <Chip
                    label={customer.Status}
                    color={getStatusColor(customer.Status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {/* ปุ่มแก้ไข */}
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(customer)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>

                  {/* ปุ่ม Check-out แสดงเฉพาะสถานะ active */}
                  {customer.Status === "active" && (
                    <IconButton
                      color="warning"
                      onClick={() => handleCheckout(customer.Customer_ID)}
                      size="small"
                    >
                      <ExitToAppIcon />
                    </IconButton>
                  )}

                  {/* ปุ่มลบ */}
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(customer.Customer_ID)}
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

      {/* Dialog สำหรับเพิ่ม/แก้ไขลูกค้า */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        {/* หัวข้อ dialog สีน้ำเงิน */}
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {editMode ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มลูกค้าใหม่"}
        </DialogTitle>

        {/* เนื้อหา dialog */}
        <DialogContent sx={{ mt: 3 }}>
          {/* Section 1: ข้อมูลพื้นฐาน */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}
            >
              ข้อมูลพื้นฐาน
            </Typography>
            {/* Grid แบ่งเป็น 4 คอลัมน์ */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="รหัสลูกค้า"
                  name="Customer_ID"
                  value={currentCustomer.Customer_ID}
                  onChange={handleChange}
                  disabled={editMode} // ถ้าแก้ไขจะกรอกไม่ได้
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="ชื่อ"
                  name="Customer_Name"
                  value={currentCustomer.Customer_Name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="นามสกุล"
                  name="Customer_Lastname"
                  value={currentCustomer.Customer_Lastname}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="เบอร์โทร"
                  name="Customer_Tel"
                  value={currentCustomer.Customer_Tel}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* Section 2: ข้อมูลห้องและสัญญา */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}
            >
              ข้อมูลห้องและสัญญา
            </Typography>
            {/* Grid แบ่งเป็น 3 คอลัมน์ */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                {/* Dropdown เลือกห้อง */}
                <TextField
                  fullWidth
                  select
                  label="ห้อง"
                  name="Customer_Room"
                  value={currentCustomer.Customer_Room}
                  onChange={handleChange}
                  required
                  disabled={editMode} // ถ้าแก้ไขจะเปลี่ยนห้องไม่ได้
                >
                  {/* วนลูปแสดงห้องว่าง */}
                  {availableRooms.map((room) => (
                    <MenuItem key={room.Room_Number} value={room.Room_Number}>
                      {room.Room_Number} - {room.Room_Type} ({room.Room_Price} บาท/เดือน)
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="เลขที่สัญญา"
                  name="ContractNo"
                  value={currentCustomer.ContractNo}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                {/* Input วันที่ */}
                <TextField
                  fullWidth
                  type="date"
                  label="วันเข้าพัก"
                  name="DateCheckin"
                  value={currentCustomer.DateCheckin}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }} // ให้ label ขึ้นข้างบนเสมอ
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* Section 3: ข้อมูลเพิ่มเติม */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
              sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}
            >
              ข้อมูลเพิ่มเติม
            </Typography>
            {/* Grid แบ่งเป็น 1:2 (ทะเบียนรถ 1 ส่วน, ที่อยู่ 2 ส่วน) */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="ทะเบียนรถ"
                  name="Customer_Car"
                  value={currentCustomer.Customer_Car}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                {/* Textarea หลายบรรทัด */}
                <TextField
                  fullWidth
                  label="ที่อยู่"
                  name="Customer_Address"
                  value={currentCustomer.Customer_Address}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  required
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
