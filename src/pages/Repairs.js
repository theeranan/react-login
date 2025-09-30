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
import EditIcon from "@mui/icons-material/Edit";       // ไอคอนแก้ไข
import DeleteIcon from "@mui/icons-material/Delete";   // ไอคอนลบ
import AddIcon from "@mui/icons-material/Add";         // ไอคอนเพิ่ม

// นำเข้า services สำหรับเรียก API
import repairService from "../services/repairService";       // service จัดการข้อมูลการซ่อมแซม
import customerService from "../services/customerService";   // service จัดการข้อมูลลูกค้า

// นำเข้า SweetAlert2 สำหรับแสดงข้อความแจ้งเตือนแบบสวยงาม
import Swal from "sweetalert2";

// Array เก็บสถานะการซ่อมแซมพร้อมสีที่แสดง
const repairStatuses = [
  { value: "PENDING", label: "รอดำเนินการ", color: "warning" },       // เหลือง - รอดำเนินการ
  { value: "IN_PROGRESS", label: "กำลังดำเนินการ", color: "info" },   // ฟ้า - กำลังทำ
  { value: "COMPLETED", label: "เสร็จสิ้น", color: "success" },       // เขียว - เสร็จแล้ว
  { value: "CANCELLED", label: "ยกเลิก", color: "error" },            // แดง - ยกเลิก
];

// Array เก็บประเภทการซ่อมแซม
const repairTypes = ["ไฟฟ้า", "ประปา", "เฟอร์นิเจอร์", "แอร์", "อื่นๆ"];

// Array เก็บระดับความสำคัญ
const priorities = [
  { value: "urgent", label: "ด่วนมาก" },   // ด่วนที่สุด
  { value: "normal", label: "ปกติ" },      // ปกติทั่วไป
  { value: "low", label: "ไม่ด่วน" },      // ไม่เร่งด่วน
];

export default function Repairs() {
  // State เก็บรายการการซ่อมแซมทั้งหมด
  const [repairs, setRepairs] = useState([]);

  // State เก็บรายการลูกค้าที่ยังเช่าอยู่
  const [customers, setCustomers] = useState([]);

  // State สถานะการโหลดข้อมูล
  const [loading, setLoading] = useState(true);

  // State เปิด/ปิด Dialog ฟอร์ม
  const [openDialog, setOpenDialog] = useState(false);

  // State บอกว่าอยู่ในโหมดแก้ไขหรือสร้างใหม่
  const [editMode, setEditMode] = useState(false);

  // State เก็บข้อมูลการซ่อมแซมที่กำลังทำงานอยู่ (แก้ไขหรือสร้างใหม่)
  const [currentRepair, setCurrentRepair] = useState({
    Repair_ID: "",                                   // รหัสการซ่อม
    Customer_ID: "",                                 // รหัสลูกค้า
    Customer_Room: "",                               // หมายเลขห้อง
    Reason: "",                                      // รายละเอียดปัญหา
    RepairType: "ไฟฟ้า",                             // ประเภทการซ่อม (เริ่มต้นเป็นไฟฟ้า)
    Status: "PENDING",                               // สถานะ (เริ่มต้นรอดำเนินการ)
    Priority: "normal",                              // ความสำคัญ (เริ่มต้นปกติ)
    ReportDate: new Date().toISOString().split("T")[0], // วันที่แจ้งซ่อม (วันนี้)
    CompletedDate: "",                               // วันที่แล้วเสร็จ
    Cost: 0,                                         // ค่าใช้จ่าย
    Note: "",                                        // หมายเหตุ
  });

  // useEffect จะทำงานครั้งเดียวตอนเริ่มต้น (โหลดข้อมูล)
  useEffect(() => {
    loadRepairs();   // โหลดรายการการซ่อมแซม
    loadCustomers(); // โหลดรายการลูกค้า
  }, []);

  // ฟังก์ชันโหลดข้อมูลการซ่อมแซมทั้งหมดจาก API
  const loadRepairs = async () => {
    try {
      const data = await repairService.getAll(); // เรียก API ดึงข้อมูล
      setRepairs(data);                           // เก็บข้อมูลลง state
    } catch (error) {
      console.error("Error loading repairs:", error);
      Swal.fire("ข้อผิดพลาด!", "ไม่สามารถโหลดข้อมูลการซ่อมแซมได้", "error");
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

  // ฟังก์ชันเปิด Dialog (กล่องป๊อปอัพ)
  const handleOpenDialog = (repair = null) => {
    if (repair) {
      // ถ้ามีข้อมูล repair ส่งเข้ามา = โหมดแก้ไข
      setEditMode(true);
      setCurrentRepair({
        ...repair,
        // แปลง Date object เป็น string format yyyy-mm-dd
        ReportDate: repair.ReportDate
          ? new Date(repair.ReportDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        CompletedDate: repair.CompletedDate
          ? new Date(repair.CompletedDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      // ถ้าไม่มีข้อมูล = โหมดสร้างใหม่
      setEditMode(false);
      setCurrentRepair({
        Repair_ID: "",
        Customer_ID: "",
        Customer_Room: "",
        Reason: "",
        RepairType: "ไฟฟ้า",
        Status: "PENDING",
        Priority: "normal",
        ReportDate: new Date().toISOString().split("T")[0],
        CompletedDate: "",
        Cost: 0,
        Note: "",
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
    setCurrentRepair((prev) => ({ ...prev, [name]: value })); // อัปเดต state
  };

  // ฟังก์ชันจัดการเมื่อเลือกลูกค้า
  const handleCustomerChange = (e) => {
    const customerId = e.target.value; // รหัสลูกค้าที่เลือก
    const selectedCustomer = customers.find(c => c.Customer_ID === customerId); // หาข้อมูลลูกค้า

    if (selectedCustomer) {
      // ถ้าเจอลูกค้า ให้ดึงหมายเลขห้องมาใส่อัตโนมัติ
      setCurrentRepair(prev => ({
        ...prev,
        Customer_ID: customerId,
        Customer_Room: selectedCustomer.Customer_Room, // กรอกหมายเลขห้องอัตโนมัติ
      }));
    } else {
      // ถ้าไม่เจอ ก็แค่ set รหัสลูกค้า
      setCurrentRepair(prev => ({
        ...prev,
        Customer_ID: customerId,
      }));
    }
  };

  // ฟังก์ชันบันทึกข้อมูล (สร้างใหม่หรือแก้ไข)
  const handleSubmit = async () => {
    try {
      if (editMode) {
        // ถ้าโหมดแก้ไข เรียก API update
        await repairService.update(currentRepair.Repair_ID, currentRepair);
        Swal.fire("สำเร็จ!", "แก้ไขข้อมูลการซ่อมแซมสำเร็จ", "success");
      } else {
        // ถ้าโหมดสร้างใหม่ เรียก API create
        await repairService.create(currentRepair);
        Swal.fire("สำเร็จ!", "เพิ่มการซ่อมแซมสำเร็จ", "success");
      }
      handleCloseDialog(); // ปิด Dialog
      loadRepairs();       // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Error saving repair:", error);
      Swal.fire(
        "ข้อผิดพลาด!",
        error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
        "error"
      );
    }
  };

  // ฟังก์ชันลบการซ่อมแซม
  const handleDelete = async (repairId) => {
    // แสดง popup ยืนยันก่อนลบ
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบการซ่อมแซมนี้หรือไม่?",
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
        await repairService.delete(repairId); // เรียก API ลบ
        Swal.fire("สำเร็จ!", "ลบการซ่อมแซมสำเร็จ", "success");
        loadRepairs(); // โหลดข้อมูลใหม่
      } catch (error) {
        console.error("Error deleting repair:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถลบการซ่อมแซมได้", "error");
      }
    }
  };

  // ฟังก์ชันอัปเดตสถานะการซ่อมแซม
  const handleStatusUpdate = async (repairId, newStatus) => {
    // หาชื่อสถานะภาษาไทย
    const statusLabel = repairStatuses.find((s) => s.value === newStatus)?.label;

    // แสดง popup ยืนยัน
    const result = await Swal.fire({
      title: "ยืนยันการเปลี่ยนสถานะ?",
      text: `คุณต้องการเปลี่ยนสถานะเป็น "${statusLabel}" หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, เปลี่ยน",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      // ถ้ายืนยัน
      try {
        await repairService.updateStatus(repairId, newStatus); // เรียก API อัปเดตสถานะ
        Swal.fire("สำเร็จ!", "เปลี่ยนสถานะสำเร็จ", "success");
        loadRepairs(); // โหลดข้อมูลใหม่
      } catch (error) {
        console.error("Error updating repair status:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถเปลี่ยนสถานะได้", "error");
      }
    }
  };

  // ฟังก์ชันสร้าง Chip แสดงสถานะการซ่อมแซม
  const getStatusChip = (status) => {
    // หาข้อมูลสถานะจาก array repairStatuses
    const statusObj = repairStatuses.find((s) => s.value === status);
    return (
      <Chip
        label={statusObj?.label || status}       // ข้อความที่แสดง
        color={statusObj?.color || "default"}    // สีของ Chip
        size="small"
      />
    );
  };

  // ฟังก์ชันกำหนดสีของ Chip ตามระดับความสำคัญ
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "error";    // แดง - ด่วนมาก
      case "normal":
        return "info";     // ฟ้า - ปกติ
      case "low":
        return "default";  // เทา - ไม่ด่วน
      default:
        return "default";
    }
  };

  // ถ้ายังโหลดข้อมูลอยู่ แสดงข้อความ Loading
  if (loading) {
    return <Typography>กำลังโหลดข้อมูล...</Typography>;
  }

  // แสดง UI หลัก
  return (
    <Box>
      {/* ส่วนหัวของหน้า มีชื่อหน้าและปุ่มแจ้งซ่อมใหม่ */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">จัดการการแจ้งซ่อม</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()} // คลิกแล้วเปิด Dialog โหมดสร้างใหม่
        >
          แจ้งซ่อมใหม่
        </Button>
      </Box>

      {/* ตารางแสดงรายการการซ่อมแซม */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* หัวตารางแต่ละคอลัมน์ */}
              <TableCell>รหัสการซ่อม</TableCell>
              <TableCell>ลูกค้า</TableCell>
              <TableCell>ห้อง</TableCell>
              <TableCell>ประเภท</TableCell>
              <TableCell>รายละเอียด</TableCell>
              <TableCell>วันที่แจ้ง</TableCell>
              <TableCell>ความสำคัญ</TableCell>
              <TableCell>ค่าใช้จ่าย</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell align="center">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* วนลูปแสดงข้อมูลการซ่อมแซมแต่ละรายการ */}
            {repairs.map((repair) => (
              <TableRow key={repair.Repair_ID}>
                <TableCell>{repair.Repair_ID}</TableCell>
                <TableCell>
                  {/* แสดงชื่อลูกค้า ถ้ามีข้อมูล ถ้าไม่มีแสดงรหัสลูกค้า */}
                  {repair.customer ?
                    `${repair.customer.Customer_Name} ${repair.customer.Customer_Lastname}`
                    : repair.Customer_ID}
                </TableCell>
                <TableCell>{repair.Customer_Room}</TableCell>
                <TableCell>{repair.RepairType}</TableCell>
                <TableCell>
                  {/* แสดงรายละเอียด ถ้ายาวเกิน 50 ตัว ให้ตัดและใส่ ... */}
                  {repair.Reason?.length > 50
                    ? repair.Reason.substring(0, 50) + "..."
                    : repair.Reason}
                </TableCell>
                <TableCell>
                  {/* แปลงวันที่เป็นรูปแบบไทย */}
                  {repair.ReportDate
                    ? new Date(repair.ReportDate).toLocaleDateString("th-TH")
                    : "-"}
                </TableCell>
                <TableCell>
                  {/* แสดง Chip ความสำคัญ */}
                  <Chip
                    label={priorities.find(p => p.value === repair.Priority)?.label || repair.Priority}
                    color={getPriorityColor(repair.Priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{repair.Cost ? repair.Cost.toLocaleString() : "0"} บาท</TableCell>
                <TableCell>
                  {/* Dropdown สำหรับเปลี่ยนสถานะ */}
                  <TextField
                    select
                    value={repair.Status}
                    onChange={(e) =>
                      handleStatusUpdate(repair.Repair_ID, e.target.value)
                    }
                    size="small"
                    variant="standard"
                    sx={{ minWidth: 120 }}
                  >
                    {/* แสดงรายการสถานะให้เลือก */}
                    {repairStatuses.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell align="center">
                  {/* ปุ่มแก้ไข */}
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(repair)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  {/* ปุ่มลบ */}
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(repair.Repair_ID)}
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

      {/* Dialog ฟอร์มสร้าง/แก้ไขการแจ้งซ่อม */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        {/* หัวข้อของ Dialog */}
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {editMode ? "แก้ไขข้อมูลการแจ้งซ่อม" : "แจ้งซ่อมใหม่"}
        </DialogTitle>

        {/* เนื้อหาในฟอร์ม */}
        <DialogContent sx={{ mt: 3 }}>
          {/* ส่วนที่ 1: ข้อมูลการแจ้งซ่อม */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ข้อมูลการแจ้งซ่อม
            </Typography>
            <Grid container spacing={3}>
              {/* เลือกลูกค้า */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="เลือกลูกค้า"
                  name="Customer_ID"
                  value={currentRepair.Customer_ID}
                  onChange={handleCustomerChange}
                  disabled={editMode} // ห้ามแก้ไขเมื่ออยู่ในโหมดแก้ไข
                  required
                >
                  {/* แสดงรายการลูกค้าให้เลือก */}
                  {customers.map((customer) => (
                    <MenuItem key={customer.Customer_ID} value={customer.Customer_ID}>
                      {customer.Customer_Room} - {customer.Customer_Name} {customer.Customer_Lastname}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* เลขห้อง (กรอกอัตโนมัติ) */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="เลขห้อง"
                  name="Customer_Room"
                  value={currentRepair.Customer_Room}
                  InputProps={{ readOnly: true }} // ไม่ให้แก้ไข
                  helperText="จะถูกกรอกอัตโนมัติเมื่อเลือกลูกค้า"
                />
              </Grid>
              {/* เลือกประเภทการซ่อม */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="ประเภทการซ่อม"
                  name="RepairType"
                  value={currentRepair.RepairType}
                  onChange={handleChange}
                  required
                >
                  {/* แสดงรายการประเภทให้เลือก */}
                  {repairTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {/* ส่วนที่ 2: สถานะและการดำเนินการ */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              สถานะและการดำเนินการ
            </Typography>
            <Grid container spacing={3}>
              {/* เลือกความสำคัญ */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label="ความสำคัญ"
                  name="Priority"
                  value={currentRepair.Priority}
                  onChange={handleChange}
                  required
                >
                  {/* แสดงรายการความสำคัญให้เลือก */}
                  {priorities.map((priority) => (
                    <MenuItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* เลือกสถานะ */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label="สถานะ"
                  name="Status"
                  value={currentRepair.Status}
                  onChange={handleChange}
                  required
                >
                  {/* แสดงรายการสถานะให้เลือก */}
                  {repairStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* วันที่แจ้งซ่อม */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="วันที่แจ้งซ่อม"
                  name="ReportDate"
                  value={currentRepair.ReportDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              {/* วันที่แล้วเสร็จ */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="วันที่แล้วเสร็จ"
                  name="CompletedDate"
                  value={currentRepair.CompletedDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ส่วนที่ 3: ค่าใช้จ่าย */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ค่าใช้จ่าย
            </Typography>
            <Grid container spacing={3}>
              {/* ค่าใช้จ่ายในการซ่อม */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="ค่าใช้จ่าย (บาท)"
                  name="Cost"
                  value={currentRepair.Cost}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ส่วนที่ 4: รายละเอียด */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              รายละเอียด
            </Typography>
            <Grid container spacing={3}>
              {/* รายละเอียดปัญหา */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="รายละเอียดปัญหา / สาเหตุ"
                  name="Reason"
                  value={currentRepair.Reason}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              {/* หมายเหตุเพิ่มเติม */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="หมายเหตุ"
                  name="Note"
                  value={currentRepair.Note}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
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
