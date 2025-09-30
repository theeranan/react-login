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
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import customerService from "../services/customerService";
import roomService from "../services/roomService";
import Swal from "sweetalert2";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
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

  useEffect(() => {
    loadCustomers();
    loadAvailableRooms();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error("Error loading customers:", error);
      Swal.fire("ข้อผิดพลาด!", "ไม่สามารถโหลดข้อมูลลูกค้าได้", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRooms = async () => {
    try {
      const data = await roomService.getAvailable();
      setAvailableRooms(data);
    } catch (error) {
      console.error("Error loading available rooms:", error);
    }
  };

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditMode(true);
      setCurrentCustomer({
        ...customer,
        DateCheckin: new Date(customer.DateCheckin).toISOString().split("T")[0],
      });
    } else {
      setEditMode(false);
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
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await customerService.update(currentCustomer.Customer_ID, currentCustomer);
        Swal.fire("สำเร็จ!", "แก้ไขข้อมูลลูกค้าสำเร็จ", "success");
      } else {
        await customerService.create(currentCustomer);
        Swal.fire("สำเร็จ!", "เพิ่มลูกค้าสำเร็จ", "success");
      }
      handleCloseDialog();
      loadCustomers();
      loadAvailableRooms();
    } catch (error) {
      console.error("Error saving customer:", error);
      Swal.fire("ข้อผิดพลาด!", error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  const handleDelete = async (customerId) => {
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

    if (result.isConfirmed) {
      try {
        await customerService.delete(customerId);
        Swal.fire("สำเร็จ!", "ลบลูกค้าสำเร็จ", "success");
        loadCustomers();
        loadAvailableRooms();
      } catch (error) {
        console.error("Error deleting customer:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถลบลูกค้าได้", "error");
      }
    }
  };

  const handleCheckout = async (customerId) => {
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
        await customerService.checkout(customerId, new Date());
        Swal.fire("สำเร็จ!", "Check-out สำเร็จ", "success");
        loadCustomers();
        loadAvailableRooms();
      } catch (error) {
        console.error("Error checkout customer:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถ Check-out ได้", "error");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "moved_out":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return <Typography>กำลังโหลดข้อมูล...</Typography>;
  }

  return (
    <Box>
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

      <TableContainer component={Paper}>
        <Table>
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
          <TableBody>
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
                  {new Date(customer.DateCheckin).toLocaleDateString("th-TH")}
                </TableCell>
                <TableCell>
                  <Chip
                    label={customer.Status}
                    color={getStatusColor(customer.Status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(customer)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  {customer.Status === "active" && (
                    <IconButton
                      color="warning"
                      onClick={() => handleCheckout(customer.Customer_ID)}
                      size="small"
                    >
                      <ExitToAppIcon />
                    </IconButton>
                  )}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {editMode ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มลูกค้าใหม่"}
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
                  label="รหัสลูกค้า"
                  name="Customer_ID"
                  value={currentCustomer.Customer_ID}
                  onChange={handleChange}
                  disabled={editMode}
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

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ข้อมูลห้องและสัญญา
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="ห้อง"
                  name="Customer_Room"
                  value={currentCustomer.Customer_Room}
                  onChange={handleChange}
                  required
                  disabled={editMode}
                >
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
                <TextField
                  fullWidth
                  type="date"
                  label="วันเข้าพัก"
                  name="DateCheckin"
                  value={currentCustomer.DateCheckin}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ข้อมูลเพิ่มเติม
            </Typography>
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