# 💳 Expense Tracker Pro

A high-performance, visually stunning Expense Management application built with **React Native (Expo)** and a robust **Node.js/MySQL** backend. This application features a modern "Emerald Slate" design language, real-time data synchronization, and advanced spending analytics.

---

## 🚀 Key Features

- **💎 Premium Glassmorphic UI**: A dark-themed, modern interface using HSL tailored colors and linear gradients.
- **📊 Detailed Spending Insights**: Beautiful bar charts and category breakdowns using `react-native-chart-kit`.
- **🔄 Real-time Synchronization**: Pull-to-refresh functionality integrated with a live XAMPP MySQL database.
- **📱 Responsive Layout**: Optimized for all mobile device sizes with safe area handling.
- **☁️ Full-Stack Architecture**: Independent Node.js Express server with relational database mapping.

---

## 🏗️ Project Architecture

The application follows a classic **M-V-C** inspired full-stack architecture:

```mermaid
graph TD
    A[Mobile App - React Native/Expo] -->|REST API Calls| B[Backend Server - Node.js/Express]
    B -->|SQL Queries| C[Database - MySQL/XAMPP]
    C -->|Data Records| B
    B -->|JSON Response| A
```

### 🛠️ Technology Stack
- **Frontend**: React Native, Expo SDK 54, Expo Linear Gradient, Vector Icons.
- **Backend**: Node.js, Express.js, MySQL2, CORS.
- **Database**: MySQL (XAMPP), Relational Schema with `transactions` and `insight` tables.

---

## 📸 App Preview

| Dashboard | Spending Insights | Transactions |
|---|---|---|
| ![Dashboard](<img src="https://img.sanishtech.com/u/2e0b5abdaceeb50a025a31c2cd534925.jpeg" alt="WhatsApp Image 2026-04-18 at 11.38.55 PM (1)" loading="lazy" style="max-width:100%;height:auto;">) | ![Insights](<img src="https://img.sanishtech.com/u/c6f21930f6eccfde35417a107ae44aeb.jpeg" alt="WhatsApp Image 2026-04-18 at 11.38.55 PM" loading="lazy" style="max-width:100%;height:auto;">) | ![Transactions](<img src="https://img.sanishtech.com/u/0aac3853ca6e7640f680a267902bd76d.jpeg" alt="WhatsApp Image 2026-04-18 at 11.38.56 PM" width="737" height="1600" loading="lazy" style="max-width:100%;height:auto;">) |

---

## ⚙️ Setup Instructions

### 1. Database Setup (XAMPP)
1. Open **XAMPP Control Panel** and start **Apache** and **MySQL**.
2. Go to `phpMyAdmin` and create a database named `beautify petals_db`.
3. Import the `setup_database.sql` file located in the `backend/` folder.

### 2. Backend Installation
```bash
cd backend
npm install
node server.js
```

### 3. Frontend Installation
1. Update `src/api/apiConfig.js` with your computer's local IP address.
2. Run the following:
```bash
npm install
npx expo start
```

---

## 📂 Project Structure
```text
Task4/
├── assets/             # Images and Icons
├── backend/            # Express Server & SQL Scripts
│   ├── server.js
│   └── setup_database.sql
├── screens/            # UI Components
│   ├── ExpenseDashboard.js
│   └── ExpenseReports.js
├── src/                # Shared utilities
│   └── api/apiConfig.js
├── App.js              # Root Navigation
└── app.json            # Expo Config
```

---

## 👤 Developer
**Rukhsar**  
*Full Stack Developer | UI/UX Enthusiast*
