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
  Divider,          // เส้นแบ่ง
} from "@mui/material";

// นำเข้าไอคอนต่างๆ จาก Material-UI
import EditIcon from "@mui/icons-material/Edit";             // ไอคอนแก้ไข
import DeleteIcon from "@mui/icons-material/Delete";         // ไอคอนลบ
import AddIcon from "@mui/icons-material/Add";               // ไอคอนเพิ่ม
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // ไอคอนยืนยันชำระเงิน

// นำเข้า services สำหรับเรียก API
import paymentService from "../services/paymentService";     // service จัดการข้อมูลการชำระเงิน
import customerService from "../services/customerService";   // service จัดการข้อมูลลูกค้า

// นำเข้า SweetAlert2 สำหรับแสดงข้อความแจ้งเตือนแบบสวยงาม
import Swal from "sweetalert2";

// Array เก็บชื่อเดือนภาษาไทยทั้ง 12 เดือน
const months = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

export default function Payments() {
  // State เก็บรายการใบแจ้งหนี้/การชำระเงินทั้งหมด
  const [payments, setPayments] = useState([]);

  // State เก็บรายการลูกค้าที่ยังเช่าอยู่
  const [customers, setCustomers] = useState([]);

  // State สถานะการโหลดข้อมูล
  const [loading, setLoading] = useState(true);

  // State เปิด/ปิด Dialog ฟอร์ม
  const [openDialog, setOpenDialog] = useState(false);

  // State บอกว่าอยู่ในโหมดแก้ไขหรือสร้างใหม่
  const [editMode, setEditMode] = useState(false);

  // ฟังก์ชันสร้างวันครบกำหนดชำระค่าเริ่มต้น (วันที่ 5 ของเดือนถัดไป)
  const getDefaultDueDate = () => {
    const date = new Date(); // สร้าง object วันที่ปัจจุบัน
    date.setDate(5);         // ตั้งเป็นวันที่ 5
    if (date < new Date()) { // ถ้าวันที่ 5 ผ่านไปแล้ว
      date.setMonth(date.getMonth() + 1); // เลื่อนไปเดือนหน้า
    }
    return date.toISOString().split("T")[0]; // แปลงเป็น format yyyy-mm-dd
  };

  // State เก็บข้อมูลใบแจ้งหนี้ที่กำลังทำงานอยู่ (แก้ไขหรือสร้างใหม่)
  const [currentPayment, setCurrentPayment] = useState({
    Pay_ID: "",                                    // รหัสใบแจ้งหนี้
    Customer_Room: "",                             // หมายเลขห้อง
    Month: months[new Date().getMonth()],          // เดือนปัจจุบัน
    Year: new Date().getFullYear(),                // ปีปัจจุบัน
    Rental: 0,                                     // ค่าเช่า
    WaterSupply: 0,                                // หน่วยน้ำ
    TotalWater: 0,                                 // ค่าน้ำรวม
    ElectricitySupply: 0,                          // หน่วยไฟ
    TotalElec: 0,                                  // ค่าไฟรวม
    Internet: 0,                                   // ค่าอินเทอร์เน็ต
    Other: 0,                                      // ค่าใช้จ่ายอื่นๆ
    FineDay: 0,                                    // จำนวนวันที่เกินกำหนด
    TotalFine: 0,                                  // ค่าปรับรวม
    Paid: 0,                                       // จำนวนเงินที่จ่ายไปแล้ว
    TotalRental: 0,                                // ยอดรวมทั้งหมด
    PaymentStatus: "UNPAID",                       // สถานะการชำระ (ยังไม่ชำระ)
    DueDate: getDefaultDueDate(),                  // วันครบกำหนดชำระ
  });

  // useEffect จะทำงานครั้งเดียวตอนเริ่มต้น (โหลดข้อมูล)
  useEffect(() => {
    loadPayments();  // โหลดรายการใบแจ้งหนี้
    loadCustomers(); // โหลดรายการลูกค้า
  }, []);

  // ฟังก์ชันโหลดข้อมูลใบแจ้งหนี้ทั้งหมดจาก API
  const loadPayments = async () => {
    try {
      const data = await paymentService.getAll(); // เรียก API ดึงข้อมูล
      setPayments(data);                           // เก็บข้อมูลลง state
    } catch (error) {
      console.error("Error loading payments:", error);
      Swal.fire("ข้อผิดพลาด!", "ไม่สามารถโหลดข้อมูลการชำระเงินได้", "error");
    } finally {
      setLoading(false); // ปิดสถานะ loading
    }
  };

  // ฟังก์ชันโหลดข้อมูลลูกค้าที่ยังเช่าอยู่
  const loadCustomers = async () => {
    try {
      const data = await customerService.getActive(); // เรียก API ดึงเฉพาะลูกค้าที่ active
      setCustomers(data);                              // เก็บข้อมูลลง state
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  };

  // ฟังก์ชันคำนวณยอดรวมทั้งหมด
  const calculateTotal = (payment) => {
    const total =
      parseInt(payment.Rental || 0) +        // ค่าเช่า
      parseInt(payment.TotalWater || 0) +    // ค่าน้ำรวม
      parseInt(payment.TotalElec || 0) +     // ค่าไฟรวม
      parseInt(payment.Internet || 0) +      // ค่าอินเทอร์เน็ต
      parseInt(payment.Other || 0) +         // ค่าใช้จ่ายอื่นๆ
      parseInt(payment.TotalFine || 0);      // ค่าปรับ
    return total;
  };

  // ฟังก์ชันเปิด Dialog (กล่องป๊อปอัพ)
  const handleOpenDialog = (payment = null) => {
    if (payment) {
      // ถ้ามีข้อมูล payment ส่งเข้ามา = โหมดแก้ไข
      setEditMode(true);
      setCurrentPayment({
        ...payment,
        // แปลง Date object เป็น string format yyyy-mm-dd
        DueDate: payment.DueDate
          ? new Date(payment.DueDate).toISOString().split("T")[0]
          : getDefaultDueDate(),
        DayPaid: payment.DayPaid
          ? new Date(payment.DayPaid).toISOString().split("T")[0]
          : null,
      });
    } else {
      // ถ้าไม่มีข้อมูล = โหมดสร้างใหม่
      setEditMode(false);
      setCurrentPayment({
        Pay_ID: "",
        Customer_Room: "",
        Month: months[new Date().getMonth()],
        Year: new Date().getFullYear(),
        Rental: 0,
        WaterSupply: 0,
        TotalWater: 0,
        ElectricitySupply: 0,
        TotalElec: 0,
        Internet: 0,
        Other: 0,
        FineDay: 0,
        TotalFine: 0,
        Paid: 0,
        TotalRental: 0,
        PaymentStatus: "UNPAID",
        DueDate: getDefaultDueDate(),
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
    const updatedPayment = { ...currentPayment, [name]: value }; // คัดลอก payment และอัปเดตค่าที่เปลี่ยน

    // ถ้าเปลี่ยนหน่วยน้ำ คำนวณค่าน้ำอัตโนมัติ (20 บาท/หน่วย)
    if (name === "WaterSupply") {
      updatedPayment.TotalWater = parseInt(value || 0) * 20;
    }

    // ถ้าเปลี่ยนหน่วยไฟ คำนวณค่าไฟอัตโนมัติ (8 บาท/หน่วย)
    if (name === "ElectricitySupply") {
      updatedPayment.TotalElec = parseInt(value || 0) * 8;
    }

    // ถ้าเปลี่ยนจำนวนวันที่เกิน คำนวณค่าปรับอัตโนมัติ (50 บาท/วัน)
    if (name === "FineDay") {
      updatedPayment.TotalFine = parseInt(value || 0) * 50;
    }

    // คำนวณยอดรวมใหม่ทุกครั้ง
    updatedPayment.TotalRental = calculateTotal(updatedPayment);

    setCurrentPayment(updatedPayment); // อัปเดต state
  };

  // ฟังก์ชันจัดการเมื่อเลือกลูกค้า (ห้อง)
  const handleCustomerChange = (e) => {
    const roomNumber = e.target.value; // หมายเลขห้องที่เลือก
    const selectedCustomer = customers.find(c => c.Customer_Room === roomNumber); // หาข้อมูลลูกค้า

    if (selectedCustomer && selectedCustomer.room) {
      // ถ้าเจอลูกค้าและมีข้อมูลห้อง ให้ดึงค่าเช่ามาใส่อัตโนมัติ
      setCurrentPayment(prev => ({
        ...prev,
        Customer_Room: roomNumber,
        Rental: selectedCustomer.room.Room_Price || 0, // ค่าเช่าจากข้อมูลห้อง
        TotalRental: calculateTotal({...prev, Rental: selectedCustomer.room.Room_Price || 0}),
      }));
    } else {
      // ถ้าไม่เจอ ก็แค่ set หมายเลขห้อง
      setCurrentPayment(prev => ({
        ...prev,
        Customer_Room: roomNumber,
      }));
    }
  };

  // ฟังก์ชันบันทึกข้อมูล (สร้างใหม่หรือแก้ไข)
  const handleSubmit = async () => {
    try {
      // สร้าง object ข้อมูลที่จะส่ง พร้อมคำนวณยอดรวมอีกครั้ง
      const finalPayment = {
        ...currentPayment,
        TotalRental: calculateTotal(currentPayment),
      };

      if (editMode) {
        // ถ้าโหมดแก้ไข เรียก API update
        await paymentService.update(currentPayment.Pay_ID, finalPayment);
        Swal.fire("สำเร็จ!", "แก้ไขข้อมูลการชำระเงินสำเร็จ", "success");
      } else {
        // ถ้าโหมดสร้างใหม่ เรียก API create
        await paymentService.create(finalPayment);
        Swal.fire("สำเร็จ!", "เพิ่มการชำระเงินสำเร็จ", "success");
      }
      handleCloseDialog(); // ปิด Dialog
      loadPayments();      // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error saving payment:", error);
      Swal.fire(
        "ข้อผิดพลาด!",
        error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
        "error"
      );
    }
  };

  // ฟังก์ชันลบใบแจ้งหนี้
  const handleDelete = async (paymentId) => {
    // แสดง popup ยืนยันก่อนลบ
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบการชำระเงินนี้หรือไม่?",
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
        await paymentService.delete(paymentId); // เรียก API ลบ
        Swal.fire("สำเร็จ!", "ลบการชำระเงินสำเร็จ", "success");
        loadPayments(); // โหลดข้อมูลใหม่
      } catch (error) {
        console.error("Error deleting payment:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถลบการชำระเงินได้", "error");
      }
    }
  };

  // ฟังก์ชันยืนยันว่าชำระเงินแล้ว
  const handleMarkAsPaid = async (paymentId) => {
    // แสดง popup ยืนยัน
    const result = await Swal.fire({
      title: "ยืนยันการชำระเงิน?",
      text: "คุณต้องการยืนยันว่าชำระเงินแล้วหรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ชำระแล้ว",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      // ถ้ายืนยัน
      try {
        await paymentService.markAsPaid(paymentId); // เรียก API ยืนยันการชำระ
        Swal.fire("สำเร็จ!", "ยืนยันการชำระเงินสำเร็จ", "success");
        loadPayments(); // โหลดข้อมูลใหม่
      } catch (error) {
        console.error("Error marking payment as paid:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถยืนยันการชำระเงินได้", "error");
      }
    }
  };

  // ฟังก์ชันกำหนดสีของ Chip ตามสถานะการชำระ
  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "success";   // เขียว - ชำระแล้ว
      case "UNPAID":
        return "error";     // แดง - ยังไม่ชำระ
      case "PARTIAL":
        return "warning";   // เหลือง - ชำระบางส่วน
      case "OVERDUE":
        return "error";     // แดง - เกินกำหนด
      default:
        return "default";
    }
  };

  // ฟังก์ชันแปลงสถานะเป็นภาษาไทย
  const getStatusLabel = (status) => {
    switch (status) {
      case "PAID":
        return "ชำระแล้ว";
      case "UNPAID":
        return "ยังไม่ชำระ";
      case "PARTIAL":
        return "ชำระบางส่วน";
      case "OVERDUE":
        return "เกินกำหนด";
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
      {/* ส่วนหัวของหน้า มีชื่อหน้าและปุ่มเพิ่มใบแจ้งหนี้ */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">จัดการการชำระเงิน</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()} // คลิกแล้วเปิด Dialog โหมดสร้างใหม่
        >
          เพิ่มใบแจ้งหนี้
        </Button>
      </Box>

      {/* ตารางแสดงรายการใบแจ้งหนี้ */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* หัวตารางแต่ละคอลัมน์ */}
              <TableCell>รหัสใบแจ้งหนี้</TableCell>
              <TableCell>ห้อง</TableCell>
              <TableCell>เดือน/ปี</TableCell>
              <TableCell>ยอดรวม</TableCell>
              <TableCell>ชำระแล้ว</TableCell>
              <TableCell>วันครบกำหนด</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell align="center">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* วนลูปแสดงข้อมูลใบแจ้งหนี้แต่ละรายการ */}
            {payments.map((payment) => (
              <TableRow key={payment.Pay_ID}>
                <TableCell>{payment.Pay_ID}</TableCell>
                <TableCell>{payment.Customer_Room}</TableCell>
                <TableCell>{payment.Month} {payment.Year}</TableCell>
                <TableCell>{payment.TotalRental?.toLocaleString()} บาท</TableCell>
                <TableCell>{payment.Paid?.toLocaleString()} บาท</TableCell>
                <TableCell>
                  {/* แปลงวันที่เป็นรูปแบบไทย */}
                  {payment.DueDate
                    ? new Date(payment.DueDate).toLocaleDateString("th-TH")
                    : "-"}
                </TableCell>
                <TableCell>
                  {/* แสดง Chip สถานะ */}
                  <Chip
                    label={getStatusLabel(payment.PaymentStatus)}
                    color={getStatusColor(payment.PaymentStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {/* ปุ่มแก้ไข */}
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(payment)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  {/* ปุ่มยืนยันการชำระ (แสดงเฉพาะเมื่อยังไม่ชำระ) */}
                  {payment.PaymentStatus !== "PAID" && (
                    <IconButton
                      color="success"
                      onClick={() => handleMarkAsPaid(payment.Pay_ID)}
                      size="small"
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )}
                  {/* ปุ่มลบ */}
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(payment.Pay_ID)}
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

      {/* Dialog ฟอร์มสร้าง/แก้ไขใบแจ้งหนี้ */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xl" fullWidth>
        {/* หัวข้อของ Dialog */}
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {editMode ? "แก้ไขใบแจ้งหนี้" : "สร้างใบแจ้งหนี้ใหม่"}
        </DialogTitle>

        {/* เนื้อหาในฟอร์ม */}
        <DialogContent sx={{ mt: 3 }}>
          {/* ส่วนที่ 1: ข้อมูลพื้นฐาน */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ข้อมูลพื้นฐาน
            </Typography>
            <Grid container spacing={3}>
              {/* รหัสใบแจ้งหนี้ */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="รหัสใบแจ้งหนี้"
                  name="Pay_ID"
                  value={currentPayment.Pay_ID}
                  onChange={handleChange}
                  disabled={editMode} // ห้ามแก้ไขเมื่ออยู่ในโหมดแก้ไข
                  required
                />
              </Grid>
              {/* เลือกห้อง (ลูกค้า) */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label="ห้อง (ลูกค้า)"
                  name="Customer_Room"
                  value={currentPayment.Customer_Room}
                  onChange={handleCustomerChange}
                  disabled={editMode} // ห้ามแก้ไขเมื่ออยู่ในโหมดแก้ไข
                  required
                >
                  {/* แสดงรายการลูกค้าให้เลือก */}
                  {customers.map((customer) => (
                    <MenuItem key={customer.Customer_Room} value={customer.Customer_Room}>
                      {customer.Customer_Room} - {customer.Customer_Name} {customer.Customer_Lastname}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* เลือกเดือน */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label="เดือน"
                  name="Month"
                  value={currentPayment.Month}
                  onChange={handleChange}
                  required
                >
                  {/* แสดงรายการเดือนให้เลือก */}
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* ระบุปี */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="ปี"
                  name="Year"
                  value={currentPayment.Year}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* ส่วนที่ 2: ค่าเช่าและค่าบริการ */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ค่าเช่าและค่าบริการ
            </Typography>
            <Grid container spacing={3}>
              {/* ค่าเช่า */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="ค่าเช่า (บาท)"
                  name="Rental"
                  value={currentPayment.Rental}
                  onChange={handleChange}
                  required
                />
              </Grid>
              {/* ค่าอินเทอร์เน็ต */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="ค่าอินเทอร์เน็ต (บาท)"
                  name="Internet"
                  value={currentPayment.Internet}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ส่วนที่ 3: ค่าน้ำและค่าไฟ */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ค่าน้ำและค่าไฟ
            </Typography>
            <Grid container spacing={3}>
              {/* มิเตอร์น้ำ (หน่วย) */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="มิเตอร์น้ำ (หน่วย)"
                  name="WaterSupply"
                  value={currentPayment.WaterSupply}
                  onChange={handleChange}
                />
              </Grid>
              {/* ค่าน้ำรวม (คำนวณอัตโนมัติ) */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="ค่าน้ำรวม (บาท)"
                  name="TotalWater"
                  value={currentPayment.TotalWater}
                  onChange={handleChange}
                  helperText="คำนวณอัตโนมัติ 20 บาท/หน่วย"
                />
              </Grid>
              {/* มิเตอร์ไฟ (หน่วย) */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="มิเตอร์ไฟ (หน่วย)"
                  name="ElectricitySupply"
                  value={currentPayment.ElectricitySupply}
                  onChange={handleChange}
                />
              </Grid>
              {/* ค่าไฟรวม (คำนวณอัตโนมัติ) */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="ค่าไฟรวม (บาท)"
                  name="TotalElec"
                  value={currentPayment.TotalElec}
                  onChange={handleChange}
                  helperText="คำนวณอัตโนมัติ 8 บาท/หน่วย"
                />
              </Grid>
            </Grid>
          </Box>

          {/* ส่วนที่ 4: ค่าปรับและค่าใช้จ่ายอื่นๆ */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ค่าปรับและค่าใช้จ่ายอื่นๆ
            </Typography>
            <Grid container spacing={3}>
              {/* จำนวนวันที่เกินกำหนด */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="จำนวนวันที่เกินกำหนด"
                  name="FineDay"
                  value={currentPayment.FineDay}
                  onChange={handleChange}
                />
              </Grid>
              {/* ค่าปรับรวม (คำนวณอัตโนมัติ) */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="ค่าปรับรวม (บาท)"
                  name="TotalFine"
                  value={currentPayment.TotalFine}
                  onChange={handleChange}
                  helperText="50 บาท/วัน"
                />
              </Grid>
              {/* ค่าใช้จ่ายอื่นๆ */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="ค่าใช้จ่ายอื่นๆ (บาท)"
                  name="Other"
                  value={currentPayment.Other}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ส่วนที่ 5: สรุปและการชำระเงิน */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              สรุปและการชำระเงิน
            </Typography>
            <Grid container spacing={3}>
              {/* ยอดรวมทั้งหมด (คำนวณอัตโนมัติและ read-only) */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="ยอดรวมทั้งหมด (บาท)"
                  name="TotalRental"
                  value={calculateTotal(currentPayment)}
                  InputProps={{ readOnly: true }} // ไม่ให้แก้ไข
                  helperText="คำนวณอัตโนมัติ"
                />
              </Grid>
              {/* จำนวนเงินที่จ่าย */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="จำนวนเงินที่จ่าย (บาท)"
                  name="Paid"
                  value={currentPayment.Paid}
                  onChange={handleChange}
                />
              </Grid>
              {/* สถานะการชำระ */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label="สถานะการชำระ"
                  name="PaymentStatus"
                  value={currentPayment.PaymentStatus}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="UNPAID">ยังไม่ชำระ</MenuItem>
                  <MenuItem value="PAID">ชำระแล้ว</MenuItem>
                  <MenuItem value="PARTIAL">ชำระบางส่วน</MenuItem>
                  <MenuItem value="OVERDUE">เกินกำหนด</MenuItem>
                </TextField>
              </Grid>
              {/* วันครบกำหนดชำระ */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="วันครบกำหนดชำระ"
                  name="DueDate"
                  value={currentPayment.DueDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        {/* ส่วนปุ่มด้านล่างของ Dialog */}
        <DialogActions>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? "บันทึก" : "สร้างใบแจ้งหนี้"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
