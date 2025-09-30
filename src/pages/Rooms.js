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
import roomService from "../services/roomService";
import Swal from "sweetalert2";

const roomTypes = ["มาตรฐาน", "ดีลักซ์", "VIP"];
const roomStatuses = [
  { value: "AVAILABLE", label: "ว่าง", color: "success" },
  { value: "OCCUPIED", label: "มีผู้เช่า", color: "error" },
  { value: "MAINTENANCE", label: "ซ่อมบำรุง", color: "warning" },
  { value: "RESERVED", label: "จองแล้ว", color: "info" },
];

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({
    Room_Number: "",
    Room_Type: "มาตรฐาน",
    Room_Floor: 1,
    Room_Size: 0,
    Room_Price: 0,
    Room_Deposit: 0,
    Description: "",
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await roomService.getAll();
      setRooms(data);
    } catch (error) {
      console.error("Error loading rooms:", error);
      Swal.fire("ข้อผิดพลาด!", "ไม่สามารถโหลดข้อมูลห้องพักได้", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (room = null) => {
    if (room) {
      setEditMode(true);
      setCurrentRoom(room);
    } else {
      setEditMode(false);
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
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await roomService.update(currentRoom.Room_Number, currentRoom);
        Swal.fire("สำเร็จ!", "แก้ไขข้อมูลห้องพักสำเร็จ", "success");
      } else {
        await roomService.create(currentRoom);
        Swal.fire("สำเร็จ!", "เพิ่มห้องพักสำเร็จ", "success");
      }
      handleCloseDialog();
      loadRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      Swal.fire("ข้อผิดพลาด!", error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  const handleDelete = async (roomNumber) => {
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

    if (result.isConfirmed) {
      try {
        await roomService.delete(roomNumber);
        Swal.fire("สำเร็จ!", "ลบห้องพักสำเร็จ", "success");
        loadRooms();
      } catch (error) {
        console.error("Error deleting room:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถลบห้องพักได้", "error");
      }
    }
  };

  const getStatusChip = (status) => {
    const statusObj = roomStatuses.find((s) => s.value === status);
    return (
      <Chip
        label={statusObj?.label || status}
        color={statusObj?.color || "default"}
        size="small"
      />
    );
  };

  if (loading) {
    return <Typography>กำลังโหลดข้อมูล...</Typography>;
  }

  return (
    <Box>
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

      <TableContainer component={Paper}>
        <Table>
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
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.Room_Number}>
                <TableCell>{room.Room_Number}</TableCell>
                <TableCell>{room.Room_Type}</TableCell>
                <TableCell>{room.Room_Floor}</TableCell>
                <TableCell>{room.Room_Size}</TableCell>
                <TableCell>{room.Room_Price.toLocaleString()}</TableCell>
                <TableCell>{room.Room_Deposit.toLocaleString()}</TableCell>
                <TableCell>{getStatusChip(room.Room_Status)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(room)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {editMode ? "แก้ไขข้อมูลห้องพัก" : "เพิ่มห้องพักใหม่"}
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ข้อมูลห้อง
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="เลขห้อง"
                  name="Room_Number"
                  value={currentRoom.Room_Number}
                  onChange={handleChange}
                  disabled={editMode}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label="ประเภทห้อง"
                  name="Room_Type"
                  value={currentRoom.Room_Type}
                  onChange={handleChange}
                  required
                >
                  {roomTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
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

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ราคาและค่าใช้จ่าย
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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

          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              รายละเอียดเพิ่มเติม
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
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