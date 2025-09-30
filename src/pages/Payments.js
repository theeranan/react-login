import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import paymentService from "../services/paymentService";
import customerService from "../services/customerService";
import Swal from "sweetalert2";

const months = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(5);
    if (date < new Date()) {
      date.setMonth(date.getMonth() + 1);
    }
    return date.toISOString().split("T")[0];
  };

  const [currentPayment, setCurrentPayment] = useState({
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

  useEffect(() => {
    loadPayments();
    loadCustomers();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await paymentService.getAll();
      setPayments(data);
    } catch (error) {
      console.error("Error loading payments:", error);
      Swal.fire("ข้อผิดพลาด!", "ไม่สามารถโหลดข้อมูลการชำระเงินได้", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await customerService.getActive();
      setCustomers(data);
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  };

  const calculateTotal = (payment) => {
    const total =
      parseInt(payment.Rental || 0) +
      parseInt(payment.TotalWater || 0) +
      parseInt(payment.TotalElec || 0) +
      parseInt(payment.Internet || 0) +
      parseInt(payment.Other || 0) +
      parseInt(payment.TotalFine || 0);
    return total;
  };

  const handleOpenDialog = (payment = null) => {
    if (payment) {
      setEditMode(true);
      setCurrentPayment({
        ...payment,
        DueDate: payment.DueDate
          ? new Date(payment.DueDate).toISOString().split("T")[0]
          : getDefaultDueDate(),
        DayPaid: payment.DayPaid
          ? new Date(payment.DayPaid).toISOString().split("T")[0]
          : null,
      });
    } else {
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
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedPayment = { ...currentPayment, [name]: value };

    if (name === "WaterSupply") {
      updatedPayment.TotalWater = parseInt(value || 0) * 20;
    }

    if (name === "ElectricitySupply") {
      updatedPayment.TotalElec = parseInt(value || 0) * 8;
    }

    if (name === "FineDay") {
      updatedPayment.TotalFine = parseInt(value || 0) * 50;
    }

    updatedPayment.TotalRental = calculateTotal(updatedPayment);

    setCurrentPayment(updatedPayment);
  };

  const handleCustomerChange = (e) => {
    const roomNumber = e.target.value;
    const selectedCustomer = customers.find(c => c.Customer_Room === roomNumber);

    if (selectedCustomer && selectedCustomer.room) {
      setCurrentPayment(prev => ({
        ...prev,
        Customer_Room: roomNumber,
        Rental: selectedCustomer.room.Room_Price || 0,
        TotalRental: calculateTotal({...prev, Rental: selectedCustomer.room.Room_Price || 0}),
      }));
    } else {
      setCurrentPayment(prev => ({
        ...prev,
        Customer_Room: roomNumber,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const finalPayment = {
        ...currentPayment,
        TotalRental: calculateTotal(currentPayment),
      };

      if (editMode) {
        await paymentService.update(currentPayment.Pay_ID, finalPayment);
        Swal.fire("สำเร็จ!", "แก้ไขข้อมูลการชำระเงินสำเร็จ", "success");
      } else {
        await paymentService.create(finalPayment);
        Swal.fire("สำเร็จ!", "เพิ่มการชำระเงินสำเร็จ", "success");
      }
      handleCloseDialog();
      loadPayments();
    } catch (error) {
      console.error("Error saving payment:", error);
      Swal.fire(
        "ข้อผิดพลาด!",
        error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
        "error"
      );
    }
  };

  const handleDelete = async (paymentId) => {
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
      try {
        await paymentService.delete(paymentId);
        Swal.fire("สำเร็จ!", "ลบการชำระเงินสำเร็จ", "success");
        loadPayments();
      } catch (error) {
        console.error("Error deleting payment:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถลบการชำระเงินได้", "error");
      }
    }
  };

  const handleMarkAsPaid = async (paymentId) => {
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
      try {
        await paymentService.markAsPaid(paymentId);
        Swal.fire("สำเร็จ!", "ยืนยันการชำระเงินสำเร็จ", "success");
        loadPayments();
      } catch (error) {
        console.error("Error marking payment as paid:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถยืนยันการชำระเงินได้", "error");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "success";
      case "UNPAID":
        return "error";
      case "PARTIAL":
        return "warning";
      case "OVERDUE":
        return "error";
      default:
        return "default";
    }
  };

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

  if (loading) {
    return <Typography>กำลังโหลดข้อมูล...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">จัดการการชำระเงิน</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          เพิ่มใบแจ้งหนี้
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
            {payments.map((payment) => (
              <TableRow key={payment.Pay_ID}>
                <TableCell>{payment.Pay_ID}</TableCell>
                <TableCell>{payment.Customer_Room}</TableCell>
                <TableCell>{payment.Month} {payment.Year}</TableCell>
                <TableCell>{payment.TotalRental?.toLocaleString()} บาท</TableCell>
                <TableCell>{payment.Paid?.toLocaleString()} บาท</TableCell>
                <TableCell>
                  {payment.DueDate
                    ? new Date(payment.DueDate).toLocaleDateString("th-TH")
                    : "-"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(payment.PaymentStatus)}
                    color={getStatusColor(payment.PaymentStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(payment)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  {payment.PaymentStatus !== "PAID" && (
                    <IconButton
                      color="success"
                      onClick={() => handleMarkAsPaid(payment.Pay_ID)}
                      size="small"
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xl" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {editMode ? "แก้ไขใบแจ้งหนี้" : "สร้างใบแจ้งหนี้ใหม่"}
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ข้อมูลพื้นฐาน
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="รหัสใบแจ้งหนี้"
                  name="Pay_ID"
                  value={currentPayment.Pay_ID}
                  onChange={handleChange}
                  disabled={editMode}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label="ห้อง (ลูกค้า)"
                  name="Customer_Room"
                  value={currentPayment.Customer_Room}
                  onChange={handleCustomerChange}
                  disabled={editMode}
                  required
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.Customer_Room} value={customer.Customer_Room}>
                      {customer.Customer_Room} - {customer.Customer_Name} {customer.Customer_Lastname}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
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
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
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

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ค่าเช่าและค่าบริการ
            </Typography>
            <Grid container spacing={3}>
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

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ค่าน้ำและค่าไฟ
            </Typography>
            <Grid container spacing={3}>
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

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ค่าปรับและค่าใช้จ่ายอื่นๆ
            </Typography>
            <Grid container spacing={3}>
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

          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              สรุปและการชำระเงิน
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="ยอดรวมทั้งหมด (บาท)"
                  name="TotalRental"
                  value={calculateTotal(currentPayment)}
                  InputProps={{ readOnly: true }}
                  helperText="คำนวณอัตโนมัติ"
                />
              </Grid>
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