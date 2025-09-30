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
import repairService from "../services/repairService";
import customerService from "../services/customerService";
import Swal from "sweetalert2";

const repairStatuses = [
  { value: "PENDING", label: "รอดำเนินการ", color: "warning" },
  { value: "IN_PROGRESS", label: "กำลังดำเนินการ", color: "info" },
  { value: "COMPLETED", label: "เสร็จสิ้น", color: "success" },
  { value: "CANCELLED", label: "ยกเลิก", color: "error" },
];

const repairTypes = ["ไฟฟ้า", "ประปา", "เฟอร์นิเจอร์", "แอร์", "อื่นๆ"];
const priorities = [
  { value: "urgent", label: "ด่วนมาก" },
  { value: "normal", label: "ปกติ" },
  { value: "low", label: "ไม่ด่วน" },
];

export default function Repairs() {
  const [repairs, setRepairs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRepair, setCurrentRepair] = useState({
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

  useEffect(() => {
    loadRepairs();
    loadCustomers();
  }, []);

  const loadRepairs = async () => {
    try {
      const data = await repairService.getAll();
      setRepairs(data);
    } catch (error) {
      console.error("Error loading repairs:", error);
      Swal.fire("ข้อผิดพลาด!", "ไม่สามารถโหลดข้อมูลการซ่อมแซมได้", "error");
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

  const handleOpenDialog = (repair = null) => {
    if (repair) {
      setEditMode(true);
      setCurrentRepair({
        ...repair,
        ReportDate: repair.ReportDate
          ? new Date(repair.ReportDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        CompletedDate: repair.CompletedDate
          ? new Date(repair.CompletedDate).toISOString().split("T")[0]
          : "",
      });
    } else {
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
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentRepair((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const selectedCustomer = customers.find(c => c.Customer_ID === customerId);

    if (selectedCustomer) {
      setCurrentRepair(prev => ({
        ...prev,
        Customer_ID: customerId,
        Customer_Room: selectedCustomer.Customer_Room,
      }));
    } else {
      setCurrentRepair(prev => ({
        ...prev,
        Customer_ID: customerId,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await repairService.update(currentRepair.Repair_ID, currentRepair);
        Swal.fire("สำเร็จ!", "แก้ไขข้อมูลการซ่อมแซมสำเร็จ", "success");
      } else {
        await repairService.create(currentRepair);
        Swal.fire("สำเร็จ!", "เพิ่มการซ่อมแซมสำเร็จ", "success");
      }
      handleCloseDialog();
      loadRepairs();
    } catch (error) {
      console.error("Error saving repair:", error);
      Swal.fire(
        "ข้อผิดพลาด!",
        error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
        "error"
      );
    }
  };

  const handleDelete = async (repairId) => {
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
      try {
        await repairService.delete(repairId);
        Swal.fire("สำเร็จ!", "ลบการซ่อมแซมสำเร็จ", "success");
        loadRepairs();
      } catch (error) {
        console.error("Error deleting repair:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถลบการซ่อมแซมได้", "error");
      }
    }
  };

  const handleStatusUpdate = async (repairId, newStatus) => {
    const statusLabel = repairStatuses.find((s) => s.value === newStatus)?.label;
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
      try {
        await repairService.updateStatus(repairId, newStatus);
        Swal.fire("สำเร็จ!", "เปลี่ยนสถานะสำเร็จ", "success");
        loadRepairs();
      } catch (error) {
        console.error("Error updating repair status:", error);
        Swal.fire("ข้อผิดพลาด!", "ไม่สามารถเปลี่ยนสถานะได้", "error");
      }
    }
  };

  const getStatusChip = (status) => {
    const statusObj = repairStatuses.find((s) => s.value === status);
    return (
      <Chip
        label={statusObj?.label || status}
        color={statusObj?.color || "default"}
        size="small"
      />
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "error";
      case "normal":
        return "info";
      case "low":
        return "default";
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
        <Typography variant="h4">จัดการการแจ้งซ่อม</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          แจ้งซ่อมใหม่
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
            {repairs.map((repair) => (
              <TableRow key={repair.Repair_ID}>
                <TableCell>{repair.Repair_ID}</TableCell>
                <TableCell>
                  {repair.customer ?
                    `${repair.customer.Customer_Name} ${repair.customer.Customer_Lastname}`
                    : repair.Customer_ID}
                </TableCell>
                <TableCell>{repair.Customer_Room}</TableCell>
                <TableCell>{repair.RepairType}</TableCell>
                <TableCell>
                  {repair.Reason?.length > 50
                    ? repair.Reason.substring(0, 50) + "..."
                    : repair.Reason}
                </TableCell>
                <TableCell>
                  {repair.ReportDate
                    ? new Date(repair.ReportDate).toLocaleDateString("th-TH")
                    : "-"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={priorities.find(p => p.value === repair.Priority)?.label || repair.Priority}
                    color={getPriorityColor(repair.Priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{repair.Cost ? repair.Cost.toLocaleString() : "0"} บาท</TableCell>
                <TableCell>
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
                    {repairStatuses.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(repair)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {editMode ? "แก้ไขข้อมูลการแจ้งซ่อม" : "แจ้งซ่อมใหม่"}
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ข้อมูลการแจ้งซ่อม
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="เลือกลูกค้า"
                  name="Customer_ID"
                  value={currentRepair.Customer_ID}
                  onChange={handleCustomerChange}
                  disabled={editMode}
                  required
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.Customer_ID} value={customer.Customer_ID}>
                      {customer.Customer_Room} - {customer.Customer_Name} {customer.Customer_Lastname}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="เลขห้อง"
                  name="Customer_Room"
                  value={currentRepair.Customer_Room}
                  InputProps={{ readOnly: true }}
                  helperText="จะถูกกรอกอัตโนมัติเมื่อเลือกลูกค้า"
                />
              </Grid>
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
                  {repairTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              สถานะและการดำเนินการ
            </Typography>
            <Grid container spacing={3}>
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
                  {priorities.map((priority) => (
                    <MenuItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
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
                  {repairStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
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

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              ค่าใช้จ่าย
            </Typography>
            <Grid container spacing={3}>
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

          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ borderBottom: 2, borderColor: "primary.main", pb: 1, mb: 3 }}>
              รายละเอียด
            </Typography>
            <Grid container spacing={3}>
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