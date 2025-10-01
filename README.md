# ระบบจัดการหอพัก (Dormitory Management System)

ระบบจัดการหอพักแบบครบวงจร พัฒนาด้วย React และ Material-UI สำหรับการจัดการลูกค้า ห้องพัก การชำระเงิน การแจ้งซ่อม พนักงาน และผู้ใช้งานระบบ

## 📋 สารบัญ

- [คุณสมบัติ](#คุณสมบัติ)
- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [ความต้องการของระบบ](#ความต้องการของระบบ)
- [การติดตั้ง](#การติดตั้ง)
- [การใช้งาน](#การใช้งาน)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [คุณสมบัติหลัก](#คุณสมบัติหลัก)
- [API Endpoints](#api-endpoints)

## ✨ คุณสมบัติ

- 🔐 ระบบล็อกอิน/ลงทะเบียนที่ปลอดภัย
- 📊 Dashboard แสดงสถิติและข้อมูลแบบเรียลไทม์
- 👥 จัดการข้อมูลลูกค้า (เพิ่ม/แก้ไข/ลบ)
- 🏠 จัดการห้องพัก (สถานะห้องว่าง/ห้องที่มีผู้เช่า)
- 💰 จัดการการชำระเงิน (บันทึกการชำระ/ตรวจสอบบิลค้างชำระ)
- 🔧 แจ้งซ่อมและติดตามสถานะงานซ่อม
- 👷 จัดการข้อมูลพนักงาน
- 🔑 จัดการผู้ใช้งานระบบ
- 📱 Responsive Design รองรับทุกขนาดหน้าจอ

## 🛠 เทคโนโลยีที่ใช้

### Frontend
- **React 19** - JavaScript library สำหรับสร้าง UI
- **React Router 6** - การจัดการ routing
- **Material-UI (MUI) 7** - UI Component library
- **Axios** - HTTP client สำหรับเรียก API
- **SweetAlert2** - แสดงข้อความแจ้งเตือนสวยงาม
- **TailwindCSS 3** - Utility-first CSS framework

### Backend API
- Backend API server ทำงานที่ `http://localhost:3001/api`
- ใช้ JWT Token สำหรับ Authentication
- RESTful API architecture

## 💻 ความต้องการของระบบ

ก่อนเริ่มติดตั้ง ตรวจสอบให้แน่ใจว่าคุณมีโปรแกรมเหล่านี้ติดตั้งแล้ว:

- **Node.js** (เวอร์ชัน 16.0 หรือสูงกว่า)
- **npm** (เวอร์ชัน 8.0 หรือสูงกว่า) หรือ **yarn**
- **Backend API Server** - จำเป็นต้องมี API server ทำงานที่ `http://localhost:3001`

## 📦 การติดตั้ง

### 1. Clone โปรเจค

```bash
git clone https://github.com/koonza1233/react-login.git
cd react-login
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

หรือถ้าใช้ yarn:

```bash
yarn install
```

### 3. ตั้งค่า API Endpoint

ตรวจสอบไฟล์ `src/services/api.js` ว่า baseURL ชี้ไปที่ backend API ของคุณ:

```javascript
const API = axios.create({
  baseURL: "http://localhost:3001/api",  // แก้ไข URL ตามที่ตั้งค่า backend
  headers: {
    "Content-Type": "application/json",
  },
});
```

### 4. เริ่มต้นใช้งาน Backend API Server

**หมายเหตุสำคัญ:** โปรเจคนี้ต้องการ Backend API Server ที่รองรับ endpoints ดังต่อไปนี้:

- Authentication: `/api/login`, `/api/register`
- Customers: `/api/customers`
- Rooms: `/api/rooms`
- Payments: `/api/payments`
- Repairs: `/api/repairs`
- Employees: `/api/employees`
- Users: `/api/users`

ตรวจสอบให้แน่ใจว่า backend server ทำงานอยู่ที่พอร์ต 3001

### 5. รันโปรเจค

```bash
npm start
```

โปรเจคจะเปิดที่ [http://localhost:3000](http://localhost:3000)

## 🚀 การใช้งาน

### การเข้าสู่ระบบ

1. เปิดเบราว์เซอร์และไปที่ `http://localhost:3000`
2. คุณจะถูกนำไปยังหน้า Login โดยอัตโนมัติ
3. กรอก **อีเมล** และ **รหัสผ่าน** เพื่อเข้าสู่ระบบ

### การสมัครสมาชิก

1. คลิกปุ่ม "สมัครสมาชิก" ที่หน้า Login
2. กรอกข้อมูล อีเมล และรหัสผ่าน
3. คลิก "สมัครสมาชิก" เพื่อสร้างบัญชีใหม่

### การใช้งานระบบหลังเข้าสู่ระบบ

หลังจากเข้าสู่ระบบสำเร็จ คุณจะเห็นหน้า Dashboard และเมนูด้านซ้าย:

#### 📊 Dashboard
- แสดงสถิติภาพรวมของระบบ
- จำนวนลูกค้า, ห้องพัก, พนักงาน
- บิลค้างชำระ และงานซ่อมที่รอดำเนินการ
- อัตราการเข้าพักแบบเรียลไทม์

#### 👥 จัดการลูกค้า (Customers)
- **ดูรายชื่อลูกค้าทั้งหมด** - แสดงตารางข้อมูลลูกค้า
- **เพิ่มลูกค้าใหม่** - คลิกปุ่ม "เพิ่มลูกค้า" เพื่อเพิ่มข้อมูลลูกค้าใหม่
- **แก้ไขข้อมูล** - คลิกปุ่มแก้ไขในแต่ละแถว
- **ลบข้อมูล** - คลิกปุ่มลบ (มีการยืนยันก่อนลบ)
- **Check Out** - บันทึกวันที่ลูกค้าย้ายออก

#### 🏠 จัดการห้องพัก (Rooms)
- **ดูรายการห้องพัก** - แสดงหมายเลขห้อง ประเภท และสถานะ
- **เพิ่มห้องใหม่** - กรอกข้อมูลห้องพัก ราคา และสถานะ
- **แก้ไขสถานะห้อง** - อัพเดทสถานะเป็น "ว่าง" หรือ "มีผู้เช่า"
- **แก้ไขข้อมูลห้อง** - แก้ไขราคาห้องและรายละเอียด

#### 💰 จัดการการชำระเงิน (Payments)
- **ดูรายการบิลทั้งหมด** - แสดงประวัติการชำระเงิน
- **เพิ่มบิลใหม่** - สร้างบิลสำหรับลูกค้า
- **บันทึกการชำระเงิน** - อัพเดทสถานะเป็น "ชำระแล้ว"
- **ดูบิลค้างชำระ** - กรองเฉพาะบิลที่ยังไม่ชำระ

#### 🔧 จัดการการแจ้งซ่อม (Repairs)
- **ดูรายการแจ้งซ่อม** - แสดงงานซ่อมทั้งหมด
- **เพิ่มรายการแจ้งซ่อมใหม่** - บันทึกปัญหาที่ต้องซ่อม
- **อัพเดทสถานะ** - เปลี่ยนสถานะเป็น "กำลังดำเนินการ" หรือ "เสร็จสิ้น"
- **ดูรายละเอียดงานซ่อม** - ตรวจสอบข้อมูลและติดตามความคืบหน้า

#### 👷 จัดการพนักงาน (Employees)
- **ดูรายชื่อพนักงาน** - แสดงข้อมูลพนักงานทั้งหมด
- **เพิ่มพนักงานใหม่** - บันทึกข้อมูลพนักงานใหม่
- **แก้ไขข้อมูล** - อัพเดทข้อมูลพนักงาน
- **ลบข้อมูล** - ลบพนักงานออกจากระบบ

#### 🔑 จัดการผู้ใช้งานระบบ (Users)
- **ดูรายชื่อผู้ใช้** - แสดงบัญชีผู้ใช้งานทั้งหมด
- **เพิ่มผู้ใช้ใหม่** - สร้างบัญชีใหม่สำหรับเข้าใช้ระบบ
- **จัดการสิทธิ์** - กำหนดสิทธิ์การเข้าถึงระบบ
- **ลบผู้ใช้** - ลบบัญชีผู้ใช้ออกจากระบบ

### การออกจากระบบ

1. คลิกปุ่ม "ออกจากระบบ" ที่เมนูด้านล่างสุด
2. ยืนยันการออกจากระบบ
3. ระบบจะนำคุณกลับไปยังหน้า Login

## 📁 โครงสร้างโปรเจค

```
react-login/
├── public/                  # Static files
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── assets/             # รูปภาพและไฟล์ static
│   ├── auth/               # ระบบ Authentication
│   │   ├── AuthProvider.js # Context สำหรับจัดการ auth state
│   │   ├── ProtectedRoute.js # Component ป้องกันเส้นทาง
│   │   └── useAuth.js      # Custom hook สำหรับใช้งาน auth
│   ├── components/         # React Components
│   │   └── Layout.js       # Layout หลักพร้อม Sidebar และ Navbar
│   ├── middleware/         # Middleware functions
│   │   └── auth.js
│   ├── pages/              # หน้าต่างๆ ของระบบ
│   │   ├── App.js          # Main app component พร้อม routing
│   │   ├── Login.js        # หน้าเข้าสู่ระบบ
│   │   ├── Register.js     # หน้าสมัครสมาชิก
│   │   ├── Dashboard.js    # หน้า Dashboard
│   │   ├── Customers.js    # หน้าจัดการลูกค้า
│   │   ├── Rooms.js        # หน้าจัดการห้องพัก
│   │   ├── Payments.js     # หน้าจัดการการชำระเงิน
│   │   ├── Repairs.js      # หน้าจัดการการแจ้งซ่อม
│   │   ├── Employees.js    # หน้าจัดการพนักงาน
│   │   ├── Users.js        # หน้าจัดการผู้ใช้งานระบบ
│   │   └── Unauthorized.js # หน้าแจ้งไม่มีสิทธิ์เข้าถึง
│   ├── services/           # API Services
│   │   ├── api.js          # Axios instance หลัก + interceptors
│   │   ├── authService.js  # Services สำหรับ authentication
│   │   ├── customerService.js
│   │   ├── roomService.js
│   │   ├── paymentService.js
│   │   ├── repairService.js
│   │   ├── employeeService.js
│   │   └── userService.js
│   ├── App.css
│   ├── index.css           # Global styles
│   └── index.js            # Entry point
├── package.json
└── README.md
```

## 🎯 คุณสมบัติหลัก

### Authentication System
- ใช้ JWT Token สำหรับการยืนยันตัวตน
- Token ถูกเก็บใน localStorage
- Axios interceptor สำหรับแนบ token ทุก request
- Auto redirect ไปหน้า login เมื่อ token หมดอายุ

### Protected Routes
- ป้องกันไม่ให้เข้าถึงหน้าต่างๆ โดยไม่ได้เข้าสู่ระบบ
- ตรวจสอบ token ก่อนแสดงผล
- Redirect ไปหน้า login หาก token ไม่ถูกต้อง

### State Management
- ใช้ React Context API สำหรับ Authentication state
- Local state ใน component สำหรับข้อมูลแต่ละหน้า
- Custom hooks สำหรับ reusable logic

### UI/UX Features
- Material-UI components สำหรับ UI ที่สวยงามและใช้งานง่าย
- Responsive design รองรับมือถือและแท็บเล็ต
- Loading states และ error handling
- SweetAlert2 สำหรับข้อความแจ้งเตือนที่สวยงาม
- Sidebar navigation พร้อม active state
- Data tables พร้อมฟังก์ชัน sort และ search

## 🔌 API Endpoints

โปรเจคนี้เชื่อมต่อกับ Backend API ที่ต้องมี endpoints ดังนี้:

### Authentication
```
POST /api/login
POST /api/register
GET  /api/auth/users
```

### Customers
```
GET    /api/customers
GET    /api/customers/:id
GET    /api/customers/status/active
POST   /api/customers
PATCH  /api/customers/:id
PATCH  /api/customers/:id/checkout
DELETE /api/customers/:id
```

### Rooms
```
GET    /api/rooms
GET    /api/rooms/:id
GET    /api/rooms/available
POST   /api/rooms
PATCH  /api/rooms/:id
DELETE /api/rooms/:id
```

### Payments
```
GET    /api/payments
GET    /api/payments/unpaid
POST   /api/payments
PATCH  /api/payments/:id
DELETE /api/payments/:id
```

### Repairs
```
GET    /api/repairs
GET    /api/repairs/pending
POST   /api/repairs
PATCH  /api/repairs/:id
DELETE /api/repairs/:id
```

### Employees
```
GET    /api/employees
GET    /api/employees/active
POST   /api/employees
PATCH  /api/employees/:id
DELETE /api/employees/:id
```

### Users
```
GET    /api/users
POST   /api/users
PATCH  /api/users/:id
DELETE /api/users/:id
```

## 🔧 Scripts ที่ใช้งานได้

```bash
# รันโปรเจคในโหมด development
npm start

# Build โปรเจคสำหรับ production
npm run build

# รัน test suite
npm test

# Eject configuration (ไม่แนะนำ)
npm run eject
```

## 🌐 Environment Variables

ถ้าต้องการเปลี่ยน API URL สามารถสร้างไฟล์ `.env` ที่ root ของโปรเจค:

```
REACT_APP_API_URL=http://localhost:3001/api
```

และแก้ไขไฟล์ `src/services/api.js`:

```javascript
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});
```

## 🐛 การแก้ปัญหา

### ปัญหา: ไม่สามารถเชื่อมต่อ API ได้

**วิธีแก้:**
1. ตรวจสอบว่า Backend API Server ทำงานอยู่ที่ `http://localhost:3001`
2. ตรวจสอบ CORS settings ที่ฝั่ง backend
3. ตรวจสอบ `baseURL` ใน `src/services/api.js`

### ปัญหา: Login แล้วถูก redirect กลับมาที่หน้า login

**วิธีแก้:**
1. ตรวจสอบว่า API ส่ง token กลับมาถูกต้อง
2. เปิด Developer Tools > Application > Local Storage ดูว่ามี token เก็บอยู่หรือไม่
3. ตรวจสอบ console log มี error หรือไม่

### ปัญหา: หน้าว่างเปล่าหรือ error

**วิธีแก้:**
1. ลบ `node_modules` และติดตั้งใหม่:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Clear browser cache และ local storage
3. ตรวจสอบ console log ใน browser

## 📄 License

ISC

## 👨‍💻 ผู้พัฒนา

พัฒนาโดย: [koonza1233](https://github.com/koonza1233)

## 🙏 การสนับสนุน

หากพบปัญหาหรือต้องการแนะนำฟีเจอร์ใหม่ กรุณาเปิด [Issue](https://github.com/koonza1233/react-login/issues) ที่ GitHub
