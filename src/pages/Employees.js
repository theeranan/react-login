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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import employeeService from "../services/employeeService";
import Swal from "sweetalert2";

const positions = ["แม่บ้าน", "รปภ.", "ช่างซ่อม", "พนักงานทั่วไป"];

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({
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

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error("Error loading employees:", error);
      Swal.fire("ข้อผิดพลาด!", "ไม่สามารถโหลดข้อมูลพนักงานได้", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (employee = null) => {
    if (employee) {
      setEditMode(true);
      setCurrentEmployee({
        ...employee,
        DateHired: employee.DateHired
          ? new Date(employee.DateHired).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
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
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await employeeService.update(currentEmployee.Emp_ID, currentEmployee);
        Swal.fire("สำเร็จ!", "แก้ไขข้อมูลพนักงานสำเร็จ", "success");
      } else {
        await employeeService.create(currentEmployee);
        Swal.fire("สำเร็จ!", "เพิ่มพนักงานสำเร็จ", "success");
      }
      handleCloseDialog();
      loadEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
      Swal.fire(
        "ข้อผิดพลาด!",
        error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
        "error"
      );
    }
  };

  const handleDelete = async (empId) => {
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
      try {
        await employeeService.delete(empId);
        Swal.fire("สำเร็จ!", "ลบพนักงานสำเร็จ", "success");
        loadEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถลบพนักงานได้", "error");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

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

  if (loading) {
    return <Typography>กำลังโหลดข้อมูล...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">จัดการพนักงาน</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          เพิ่มพนักงาน
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
            {employees.map((employee) => (
              <TableRow key={employee.Emp_ID}>
                <TableCell>{employee.Emp_ID}</TableCell>
                <TableCell>
                  {employee.Emp_Name} {employee.Emp_Lastname}
                </TableCell>
                <TableCell>{employee.Emp_Position}</TableCell>
                <TableCell>{employee.Emp_Tel}</TableCell>
                <TableCell>{employee.Emp_Salary?.toLocaleString()} บาท</TableCell>
                <TableCell>
                  {employee.DateHired
                    ? new Date(employee.DateHired).toLocaleDateString("th-TH")
                    : "-"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(employee.Emp_Status)}
                    color={getStatusColor(employee.Emp_Status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(employee)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {editMode ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่"}
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
                  label="รหัสพนักงาน"
                  name="Emp_ID"
                  value={currentEmployee.Emp_ID}
                  onChange={handleChange}
                  disabled={editMode}
                  required
                />
              </Grid>
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

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ข้อมูลการทำงาน
            </Typography>
            <Grid container spacing={3}>
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
                  {positions.map((position) => (
                    <MenuItem key={position} value={position}>
                      {position}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
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

          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ที่อยู่และสถานะ
            </Typography>
            <Grid container spacing={3}>
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