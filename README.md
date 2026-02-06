# SkillBridge Backend 🎓  
**Backend API for SkillBridge – Connect with Expert Tutors**

## 📌 Project Overview
The **SkillBridge Backend** is a RESTful API built with **Node.js and Express** that powers the SkillBridge tutoring platform.  
It handles authentication, role-based authorization, tutor discovery, bookings, reviews, and administrative operations.

The backend follows a **backend-first architecture**, exposing secure APIs consumed by the frontend.

---

## 🧠 Core Responsibilities
- User authentication and authorization
- Role-based access control (Student, Tutor, Admin)
- Tutor profile and availability management
- Booking and review system
- Email notifications
- Admin moderation and analytics
- Secure database operations

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|--------|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **Better Auth** | Authentication & session management |
| **Prisma ORM** | Database ORM and migrations |
| **PostgreSQL** | Relational database |
| **Nodemailer** | Email notifications |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |

---

## 🔐 Authentication & Authorization
- Authentication powered by **Better Auth**
- Secure session handling
- Role-based access control (RBAC)
- Protected routes using middleware
- Admin accounts are **seeded in the database**

### User Roles
- **Student**
- **Tutor**
- **Admin**

---

## ✨ Features

### 👤 User Management
- User registration and login
- Role selection during registration
- Profile management
- Secure session handling

### 👨‍🏫 Tutor Management
- Tutor profile creation and updates
- Subject/category association
- Availability slot management
- Rating and review tracking

### 📅 Booking System
- Session booking between students and tutors
- View upcoming and past bookings
- Booking status management

### ⭐ Reviews
- Students can leave reviews after sessions
- Tutor ratings aggregation

### 🛡️ Admin Controls
- View all users
- Ban / unban users
- View all bookings
- Manage tutoring categories

### 📧 Email Notifications
- Account verification emails
- Booking confirmations
- Session reminders
- Powered by **Nodemailer**

---

## 📂 Project Structure

```text
prisma/
├── migrations/
└── schema.prisma
src/
├── lib/
│   ├── auth.ts                 # Better Auth configuration
│   └── prisma.ts              # Prisma client instance
│
├── middleware/
│   └── auth.ts                # Authentication & role-based guards
│
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   └── auth.services.ts
│   │
│   ├── users/
│   │   ├── users.routes.ts
│   │   ├── users.controller.ts
│   │   └── users.services.ts
│   │
│   ├── tutor/
│   │   ├── tutor.routes.ts
│   │   ├── tutor.controller.ts
│   │   └── tutor.services.ts
│   │
│   ├── availability/
│   │   ├── availability.routes.ts
│   │   ├── availability.controller.ts
│   │   └── availability.services.ts
│   │
│   ├── booking/
│   │   ├── booking.routes.ts
│   │   ├── booking.controller.ts
│   │   └── booking.services.ts
│   │
│   ├── reviews/
│   │   ├── reviews.routes.ts
│   │   ├── reviews.controller.ts
│   │   └── reviews.services.ts
│   │
│   ├── categories/
│   │   ├── categories.routes.ts
│   │   ├── categories.controller.ts
│   │   └── categories.services.ts
│   │
│   ├── tutorCategories/
│   │   ├── tutorCategories.routes.ts
│   │   ├── tutorCategories.controller.ts
│   │   └── tutorCategories.services.ts
│   │
│   ├── admin/
│   │   ├── admin.routes.ts
│   │   ├── admin.controller.ts
│   │   └── admin.services.ts
│   │
│   └── adminAnalytics/
│       ├── auth/
│       │   ├── adminAuth.routes.ts
│       │   ├── adminAuth.controller.ts
│       │   └── adminAuth.services.ts
│       │
│       ├── availability/
│       │   ├── adminAvailability.routes.ts
│       │   ├── adminAvailability.controller.ts
│       │   └── adminAvailability.services.ts
│       │
│       ├── booking/
│       │   ├── adminBooking.routes.ts
│       │   ├── adminBooking.controller.ts
│       │   └── adminBooking.services.ts
│       │
│       ├── categories/
│       │   ├── adminCategories.routes.ts
│       │   ├── adminCategories.controller.ts
│       │   └── adminCategories.services.ts
│       │
│       ├── reviews/
│       │   ├── adminReviews.routes.ts
│       │   ├── adminReviews.controller.ts
│       │   └── adminReviews.services.ts
│       │
│       ├── tutor/
│       │   ├── adminTutor.routes.ts
│       │   ├── adminTutor.controller.ts
│       │   └── adminTutor.services.ts
│       │
│       ├── tutorCategories/
│       │   ├── adminTutorCategories.routes.ts
│       │   ├── adminTutorCategories.controller.ts
│       │   └── adminTutorCategories.services.ts
│       │
│       └── users/
│           ├── adminUsers.routes.ts
│           ├── adminUsers.controller.ts
│           └── adminUsers.services.ts
│
├── scripts/
│   └── seedAdmin.ts            # Seed admin accounts
│
├── app.ts                      # Express app configuration
└── server.ts                   # Server bootstrap

Each module follows a strict **routes → controller → services** pattern.

```

## 🌐 API Routes (Overview)

### 🔓 Public Routes
| Method | Endpoint | Description |
|------|----------|-------------|
| GET | `/api/availability` | Get all availability slots |
| GET | `/api/availability/:id` | Get single availability |
| GET | `/api/availability/tutor/:tutorId` | Get availability by tutor |
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get single category |
| GET | `/api/reviews` | Get all reviews |
| GET | `/api/tutors` | Browse tutors |
| GET | `/api/tutors/:id` | Get tutor profile |
| GET | `/api/tutors/by-user/:userId` | Get tutor by user ID |

---

### 🎒 Student Routes (Protected)
| Method | Endpoint | Description |
|------|----------|-------------|
| GET | `/api/bookings/student/me` | View my bookings |
| GET | `/api/bookings/tutor/:tutorId/public` | View tutor public bookings |
| POST | `/api/bookings` | Create a booking |
| PATCH | `/api/bookings/:id` | Update booking |
| POST | `/api/reviews` | Leave a review |
| PATCH | `/api/reviews/:id` | Update my review |
| DELETE | `/api/reviews/:id` | Delete my review |

---

### 👨‍🏫 Tutor Routes (Protected)
| Method | Endpoint | Description |
|------|----------|-------------|
| GET | `/api/availability/me` | Get my availability |
| POST | `/api/availability/me` | Create availability |
| PATCH | `/api/availability/:id` | Update availability |
| DELETE | `/api/availability/:id` | Delete availability |
| GET | `/api/bookings/tutor/:id` | Get my bookings |
| GET | `/api/bookings/tutor/:id/upcoming` | Get upcoming bookings |
| GET | `/api/tutors/dashboard/:id` | Tutor dashboard statistics |
| PATCH | `/api/tutors` | Update tutor profile |
| DELETE | `/api/tutors/:id` | Delete tutor profile |
| POST | `/api/tutor-categories` | Add tutor category |
| DELETE | `/api/tutor-categories/:id` | Remove tutor category |
| GET | `/api/reviews/tutor/:id` | Get my reviews |

---

### 🛡️ Admin Routes (Protected)
| Method | Endpoint | Description |
|------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/users/:id` | Update user |
| GET | `/api/admin/tutor` | Get all tutors |
| GET | `/api/admin/bookings` | Get all bookings |
| GET | `/api/admin/dashboard` | Admin dashboard statistics |
| POST | `/api/admin/categories` | Create category |
| PATCH | `/api/admin/categories/:id` | Update category |
| GET | `/api/admin-analytics/dashboard` | Admin analytics dashboard |
| GET | `/api/admin-analytics/stats` | Platform statistics |
| GET | `/api/reviews/admin` | Get all reviews |
| DELETE | `/api/reviews/admin/:id` | Delete review |

---

### 🔐 Authenticated Routes
| Method | Endpoint | Description |
|------|----------|-------------|
| GET | `/api/auth` | Get current user |
| POST | `/api/auth/sign-out` | Sign out |
| GET | `/api/auth/tutor-only` | Tutor-only test route |

---

## 🗄️ Database Schema (Core Tables)

- **User**
- **TutorProfile**
- **Category**
- **Booking**
- **Review**
- **Availability**
- **TutorCategory**

> Managed using **Prisma ORM** with **PostgreSQL**.

---

## 🚀 Getting Started

### 1️⃣ Install dependencies
```bash
npm install
```
## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/skillbridge
BETTER_AUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret_key
APP_USER=your_email@gmail.com
APP_PASS=your_email_password
APP_URL=http://localhost:3000
```
### 3️⃣ Run database migrations
```bash
npx prisma migrate dev
```
### 4️⃣ Seed admin user
```bash
npm run seed:admin
```
### 5️⃣ Start development server
```bash
npm run dev
```

## 🚀 Getting Started
### 1️⃣ Clone the repository
```bash
git clone https://github.com/noornabi-noor/SkillBridge-Backend-.git
cd skillbridge-backend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Setup Prisma
```bash
npx prisma generate
npx prisma migrate dev
```

### 4️⃣ Seed Admin User
```bash
node prisma/seed.js
```

### 5️⃣ Run the server
```bash
npm run dev
```
Server will start at:
```bash
📍 http://localhost:5000
```