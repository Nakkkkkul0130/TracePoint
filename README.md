# 🌐 TracePoint

<<<<<<< HEAD
**TracePoint** is a modern full-stack Lost & Found web application built with **React**, **Node.js**, **Express**, and **MongoDB**.  
Users can report lost items, view found ones, and chat securely with item reporters.  
Admins can monitor and manage submissions through a dedicated dashboard.
=======
**TracePoint** is a modern full-stack Lost & Found web application built with **React**, **Node.js**, **Express**, and **MongoDB**. Users can report lost items, view found ones, and chat securely with item reporters. Admins can monitor and manage submissions through a dedicated dashboard.
>>>>>>> bd44b192bcfaa3308c51f99bc06f786b70afb554

Built with a clean and responsive UI using **Tailwind CSS**, **Framer Motion**, and **Cloudinary** for image uploads. ⚡️

---

## ✨ Features

### 👤 For Users
<<<<<<< HEAD
=======

>>>>>>> bd44b192bcfaa3308c51f99bc06f786b70afb554
- 📝 Report Lost Items (with image upload to Cloudinary)
- 👁️ View Found Items
- 💬 Real-time Chat (Socket.IO)
- ✅ Claim Verification system
- 🔐 JWT Authentication (Signup/Login)
- 🌙 Light/Dark Theme Toggle
- 📥 Message History per item/user
- 📷 Image upload via Cloudinary

### 🛠️ For Admin (You)
<<<<<<< HEAD
- 🧑‍💼 Admin Dashboard  
- 📋 View and Manage Lost Reports  
- 👀 Monitor Found Items  
- ❌ Delete or Moderate Items (optional)  
=======

- 🧑‍💼 Admin Dashboard  
- 📋 View and Manage Lost Reports  
- 👀 Monitor Found Items  
- ❌ Delete or Moderate Items (optional)
>>>>>>> bd44b192bcfaa3308c51f99bc06f786b70afb554
- 🔍 See User & Contact Info on Reports  

---

<<<<<<< HEAD
## 🧑‍💻 Tech Stack

### 🖥 Frontend
=======
## 🔧 Tech Stack

### 🖥 Frontend

>>>>>>> bd44b192bcfaa3308c51f99bc06f786b70afb554
- ⚛️ React (Vite)
- 🎨 Tailwind CSS
- 💫 Framer Motion
- 🔀 React Router
- 🗂️ Axios for API Calls

### 🗄 Backend
<<<<<<< HEAD
=======

>>>>>>> bd44b192bcfaa3308c51f99bc06f786b70afb554
- 🚀 Node.js + Express
- 🧠 MongoDB + Mongoose
- 🔐 JWT Auth Middleware
- ☁️ Cloudinary (Image Storage)
- 💬 Socket.IO for Chat
- ✉️ Nodemailer (Contact Form)

---

## 🧑‍💻 Installation & Setup

<<<<<<< HEAD
### 1️⃣ Clone the Repository
=======
### 1️⃣ Clone the repository
>>>>>>> bd44b192bcfaa3308c51f99bc06f786b70afb554

```bash
git clone https://github.com/Nakkkkkul0130/TracePoint
cd TracePoint
<<<<<<< HEAD

### 2️⃣ Setup Backend
```bash

cd server
npm install

### ➕ Create a .env file in /server with:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Start backend server:

node index.js

### 3️⃣ Setup Frontend
```
cd ../client
npm install
npm run dev
Visit: http://localhost:5173

### 🌍 Live Deployment
Component	URL
🌍 Frontend	https://tracepoint.vercel.app
🚀 Backend	https://tracepoint-usj3.onrender.com

### 📤 Cloudinary Image Upload
Both Lost and Found item reports support secure image uploads using Multer + Cloudinary.
Images are stored and served via secure public Cloudinary URLs.

### 💬 Real-Time Chat
Socket.IO is used for 1-to-1 messaging

Room = itemId + sender/receiverId based

Auto-scroll + chat persistence in MongoDB

Chat preview shown in Inbox (latest message)

### 📧 Contact Form
Sends user message to admin email via Nodemailer

Also stores contact message in MongoDB for reference

### 🔐 Auth & Security
JWT Authentication

Tokens stored in HTTP-only Cookies

All routes protected via middleware

Admin dashboard access is reserved

### 🧾 License
This project is licensed under the MIT License.

MIT License

Copyright (c) 2025 Nakul

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...


### 👨‍💻 Author
Developed with ❤️ by:
=======
>>>>>>> bd44b192bcfaa3308c51f99bc06f786b70afb554

Nakul Bhar
🔗 @Nakkkkkul0130
📧 nakulbhar13@gmail.com