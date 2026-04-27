# SkillBridge Backend 🎓  
**The Core API for SkillBridge – Empowering Expert Tutoring Connections**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)

## 📌 Project Overview
The **SkillBridge Backend** is a high-performance RESTful API designed to power the SkillBridge tutoring ecosystem. Built with **Node.js, Express, and TypeScript**, it provides a robust infrastructure for authentication, secure payments, real-time availability management, and administrative oversight.

The system follows a clean **Modular Architecture** (Routes → Controller → Service), ensuring scalability and maintainability.

---

## 🚀 Key Features

### 👤 Identity & Access
- **Secure Authentication**: Powered by **Better Auth** with role-based access control (RBAC).
- **Multi-Role Support**: Tailored experiences for Students, Tutors, and Administrators.
- **Profile Management**: Dynamic profile updates and association with tutoring categories.

### 💳 Financial Integration
- **Stripe Payments**: Integrated checkout flow for session bookings.
- **Webhook Handling**: Automated booking confirmation upon successful payment detection.
- **Payment Verification**: Secure server-side validation of transaction statuses.

### 📅 Tutoring Workflow
- **Availability Management**: Tutors can define and manage their time slots.
- **Booking Engine**: Students can browse tutors, check availability, and book sessions.
- **Review System**: Automated rating aggregation and verified reviews post-session.

### 🛡️ Administrative Suite
- **User Moderation**: Ability to manage user statuses (Ban/Unban).
- **Global Overview**: Unified dashboard for tracking all bookings, users, and platform analytics.
- **Category Management**: dynamic creation and editing of tutoring subjects.

---

## 🛠️ Tech Stack

| Category | Technology |
|:--- |:--- |
| **Runtime** | Node.js (v20+) |
| **Framework** | Express.js 5.x |
| **Language** | TypeScript |
| **Auth** | Better Auth |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **Payments** | Stripe API |
| **Email** | Nodemailer |
| **Tooling** | tsup, tsx, dotenv |

---

## 📂 Project Structure

```text
src/
├── lib/               # Shared libraries (Prisma, Auth, Stripe)
├── middleware/        # Authentication & Role guards
├── modules/           # Feature-based business logic
│   ├── admin/         # Platform administration
│   ├── auth/          # Authentication handlers
│   ├── availability/  # Tutor schedule management
│   ├── bookings/      # Session booking logic
│   ├── payments/      # Stripe integration & webhooks
│   ├── reviews/       # Feedback & Ratings
│   ├── tutor/         # Tutor profile logic
│   └── users/         # User profile management
├── scripts/           # Maintenance & Seeding scripts
├── app.ts             # Express application setup
└── server.ts          # Entry point
```

---

## 🌐 API Reference (Highlights)

### 💳 Payment Routes
| Method | Endpoint | Description |
|:--- |:--- |:--- |
| `POST` | `/api/payments/create-checkout-session` | Initialize Stripe session |
| `POST` | `/api/payments/webhook` | Stripe event listener |
| `POST` | `/api/payments/verify` | Internal payment verification |

### 📅 Booking & Availability
| Method | Endpoint | Description |
|:--- |:--- |:--- |
| `GET` | `/api/availability/me` | Fetch tutor's own slots |
| `POST` | `/api/bookings` | Create new booking |
| `GET` | `/api/bookings/student/me` | View user's booked sessions |

### 🛡️ Admin API
| Method | Endpoint | Description |
|:--- |:--- |:--- |
| `GET` | `/api/admin/dashboard` | Platform metrics & overview |
| `PATCH` | `/api/admin/users/:id` | Update user status/roles |

> [!TIP]
> For a full list of routes, refer to the individual module directories in `src/modules/`.

---

## ⚙️ Getting Started

### 1️⃣ Clone & Install
```bash
git clone https://github.com/noornabi-noor/SkillBridge-Backend-.git
cd SkillBridge-Backend-
npm install
```

### 2️⃣ Environment Configuration
Create a `.env` file in the root:
```env
# Server
PORT=5000
APP_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"

# Auth (Better Auth)
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:5000

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Nodemailer)
APP_USER=your_email@gmail.com
APP_PASS=your_app_password
```

### 3️⃣ Database Initialization
```bash
npx prisma generate
npx prisma migrate dev
npm run seed:admin
```

### 4️⃣ Launch
```bash
# Development mode
npm run dev

# Build for production
npm run build
```

---

## 🗄️ Database Schema
Managed via **Prisma**. The visual schema can be explored here:
[View ER Diagram on DrawSQL](https://drawsql.app/teams/myself-668/diagrams/skillbridge)

![Database Schema](https://i.ibb.co.com/PGHvJC8Q/skillbridge.png)

---

## 📄 License
This project is licensed under the [ISC License](LICENSE).