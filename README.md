# 🌐 TracePoint

**TracePoint** is a modern full-stack Lost & Found web application built with **React**, **Node.js**, **Express**, and **MongoDB**. Users can report lost items, view found ones, and chat securely with item reporters. Admins can monitor and manage submissions through a dedicated dashboard.

Built with a clean and responsive UI using **Tailwind CSS**, **Framer Motion**, and **Cloudinary** for image uploads. ⚡️

---

## ✨ Features

### 👤 For Users

- 📝 Report Lost Items (with image upload to Cloudinary)
- 👁️ View Found Items
- 💬 Real-time Chat (Socket.IO)
- ✅ Claim Verification system
- 🔐 JWT Authentication (Signup/Login)
- 🌙 Light/Dark Theme Toggle
- 📥 Message History per item/user
- 📷 Image upload via Cloudinary

### 🛠️ For Admin (me)

- 🧑‍💼 Admin Dashboard  
- 📋 View and Manage Lost Reports  
- 👀 Monitor Found Items  
- ❌ Delete or Moderate Items (optional)  
- 🧑‍💼 Admin Dashboard  
- 📋 View and Manage Lost Reports  
- 👀 Monitor Found Items  
- ❌ Delete or Moderate Items (optional)
- 🔍 See User & Contact Info on Reports  

---

## 🧑‍💻 Tech Stack

### 🖥 Frontend

- ⚛️ React (Vite)
- 🎨 Tailwind CSS
- 💫 Framer Motion
- 🔀 React Router
- 🗂️ Axios for API Calls

### 🗄 Backend
- 🚀 Node.js + Express
- 🧠 MongoDB + Mongoose
- 🔐 JWT Auth Middleware
- ☁️ Cloudinary (Image Storage)
- 💬 Socket.IO for Chat
- ✉️ Nodemailer (Contact Form)

---

## 🧑‍💻 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Nakkkkkul0130/TracePoint
cd TracePoint
```
### 2️⃣ Setup Backend
```
cd server
npm install
```
### ➕ Create a .env file in /server with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
### Start backend server:
```
node index.js
```
### 3️⃣ Setup Frontend

cd Frontend
npm install
npm run dev

### 🌍 Live Deployment
Component	URL
🌍 Frontend	https://tracepoint.vercel.app
🚀 Backend	https://tracepoint-usj3.onrender.com


### 🧾 License
This project is licensed under the MIT License.
MIT License
Copyright (c) 2025 Nakul


### 👨‍💻 Author
Developed with ❤️ by: Nakul Bhar
🔗 @Nakkkkkul0130
📧 nakulbhar13@gmail.com