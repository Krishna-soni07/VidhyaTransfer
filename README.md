# VidhyaTransfer 🎓

> A full-stack skill-sharing and knowledge exchange platform that connects students and professionals through peer-to-peer learning, real-time chat, events, and a credit-based economy.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Admin Setup](#admin-setup)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Contributing](#contributing)

---

## Overview

**VidhyaTransfer** is a platform where users can share their skills, discover others, request knowledge exchanges (PeerSwap), attend events, and interact through a social feed — all backed by a credit-based transaction system and real-time messaging.

The project is split into **three applications**:

| App | Description |
|-----|-------------|
| `Frontend` | Main user-facing React app |
| `Backend` | Node.js + Express REST API & Socket.IO server |
| `Admin` | Internal admin dashboard for managing users, posts, events & reports |

---

## Features

### 👤 User
- Register / Login with Email & Password or Google OAuth
- Onboarding flow to set up profile, skills, and interests
- Edit profile with avatar upload (Cloudinary)
- Credit wallet system (earn & spend credits)

### 🔄 PeerSwap (Skill Exchange)
- Send and receive skill exchange requests
- Browse and discover users by skills
- Rate users after a session

### 💬 Real-Time Chat
- One-on-one messaging via Socket.IO
- Emoji picker support
- Chat request system

### 📰 Social Feed
- Create posts with images
- Like, comment, and reply on posts
- Nested reply threads

### 🎟️ Events
- Browse and register for events
- Create and manage events
- Payment integration via Razorpay

### 📦 Resources & SkillGain
- Upload and share learning resources
- SkillGain pages for discovering new skills

### 🔔 Notifications
- In-app notifications for requests, messages, events, and activity

### 🛡️ Admin Dashboard
- Dashboard with analytics (Recharts)
- Manage users, posts, events, and reports
- View activity logs
- Manage platform settings

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Zustand | Global state management |
| Socket.IO Client | Real-time communication |
| Axios | HTTP requests |
| Framer Motion | Animations |
| React Toastify | Toast notifications |
| Tailwind CSS | Utility-first styling |
| React Hook Form | Form handling |
| React Razorpay | Payment integration |
| Bootstrap 5 | Component library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Socket.IO | Real-time WebSocket server |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Passport.js | Google OAuth 2.0 |
| Cloudinary | Image/media storage |
| Multer | File upload handling |
| Nodemailer | Email notifications |
| Razorpay | Payment processing |

### Admin
| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| Vite | Build tool |
| React Router v6 | Routing |
| Recharts | Data visualization & charts |
| Axios | HTTP requests |
| Tailwind CSS | Styling |

---

## Project Structure

```
VidhyaTransfer/
├── Backend/
│   └── src/
│       ├── config/          # DB & Cloudinary config
│       ├── controllers/     # Route controllers (auth, chat, events, posts, etc.)
│       ├── middlewares/     # Auth, upload, error middlewares
│       ├── models/          # Mongoose models
│       │   ├── user.model.js
│       │   ├── post.model.js
│       │   ├── event.model.js
│       │   ├── chat.model.js
│       │   ├── message.model.js
│       │   ├── request.model.js
│       │   ├── rating.model.js
│       │   ├── report.model.js
│       │   └── transaction.model.js
│       ├── routes/          # API route definitions
│       ├── scripts/         # Seed scripts
│       ├── utils/           # Helper utilities
│       └── index.js         # Entry point
│
├── Frontend/
│   └── src/
│       ├── Components/      # Shared/reusable components
│       ├── Pages/           # Page-level components
│       │   ├── LandingPage/
│       │   ├── Login/ & Register/
│       │   ├── Onboarding/
│       │   ├── Feed/
│       │   ├── Discover/
│       │   ├── Profile/ & EditProfile/
│       │   ├── Chat/ & Chats/
│       │   ├── PeerSwap/
│       │   ├── Events/
│       │   ├── Notifications/
│       │   ├── Credits/
│       │   ├── Rating/
│       │   ├── Report/
│       │   ├── Resources/
│       │   ├── SkillGain/
│       │   ├── Settings/
│       │   └── Utilization/
│       ├── store/           # Zustand store
│       └── util/            # Utility functions
│
└── Admin/
    └── src/
        ├── components/      # Shared admin components (Layout, etc.)
        ├── context/         # Auth context
        └── pages/           # Admin pages
            ├── Dashboard.jsx
            ├── Users.jsx
            ├── Posts.jsx
            ├── Events.jsx
            ├── Reports.jsx
            ├── Activity.jsx
            ├── Settings.jsx
            └── Login.jsx
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or above)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

---

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory (see [Environment Variables](#environment-variables)).

```bash
# Development
npm run dev

# Production
npm start
```

The backend runs on **http://localhost:5000** by default.

---

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173** by default.

---

### Admin Setup

```bash
cd Admin
npm install
npm run dev
```

The admin panel runs on **http://localhost:5174** by default.

---

## Environment Variables

### Backend (`Backend/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

CLIENT_URL=http://localhost:5173
```

### Frontend (`Frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## API Overview

| Module | Base Route | Description |
|--------|-----------|-------------|
| Auth | `/api/auth` | Register, Login, Google OAuth, Logout |
| User | `/api/user` | Profile, follow, discover, search |
| Onboarding | `/api/onboarding` | Setup skills, interests, profile |
| Post | `/api/post` | CRUD posts, likes, comments |
| Chat | `/api/chat` | Chat rooms management |
| Message | `/api/message` | Send & fetch messages |
| Request | `/api/request` | PeerSwap requests (send/accept/reject) |
| Event | `/api/event` | Create, browse, register for events |
| Skill | `/api/skill` | Skills CRUD |
| Payment | `/api/payment` | Razorpay order creation & verification |
| Rating | `/api/rating` | Rate users after sessions |
| Report | `/api/report` | Report users/posts |
| Admin | `/api/admin` | Admin-only management routes |

---

## Contributing

1. Fork the repository
2. Create a new feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

<p align="center">Built with ❤️ by <strong>Fx31 Labs</strong></p>
