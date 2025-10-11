# 🌐 TracePoint

**TracePoint** is a modern full-stack Lost & Found web application built with **React**, **Node.js**, **Express**, and **MongoDB**. Users can report lost items, view found ones, and chat securely with item reporters. Admins can monitor and manage submissions through a dedicated dashboard.

Built with a clean and responsive UI using **Tailwind CSS**, **Framer Motion**, and **Cloudinary** for image uploads. ⚡️

---

## ✨ Features

### 👤 For Users

- 📝 **Report Lost Items** - Upload details with unique verification codes
- 🎯 **Report Found Items** - Submit found items with office verification system
- 👁️ **Browse Found Items** - View items found by others (excluding your own)
- 💬 **Real-time Chat** - Secure messaging with Socket.IO
- 🔐 **Claim Verification** - Use verification codes to claim items
- 🏢 **Office Collection System** - Physical item verification and collection
- 🌙 **Light/Dark Theme Toggle**
- 📥 **Message History** per item/user
- 📷 **Image Upload** via Cloudinary
- 📱 **Responsive Design** - Works on all devices
- ⏳ **Engaging Loading Screen** - Interactive loading with helpful tips

### 🛠️ For Admin

- 🧑💼 **Admin Dashboard** with comprehensive management tools
- 📋 **Manage Lost Reports** - View and moderate lost item submissions
- 👀 **Monitor Found Items** - Track found item submissions and office status
- 🏢 **Office Submissions** - Verify items submitted to office
- ✅ **Claim Verification** - Review chat conversations and approve/reject claims
- 📦 **Collection Management** - Track items ready for collection
- 📊 **Statistics Dashboard** - View platform analytics and success rates
- ❌ **Content Moderation** - Delete inappropriate submissions

---

## 🔄 How TracePoint Works

### 🔍 Lost Something?

1. **Report Your Lost Item** - Fill out form with details and get a unique verification code
2. **Browse Found Items** - Check if someone has already found your item
3. **Chat & Claim** - Contact finder and use verification code to claim your item
4. **Admin Verification** - Admin reviews conversation and approves legitimate claims
5. **Office Collection** - Collect your verified item from TracePoint office

### 🎯 Found Something?

1. **Report Found Item** - Upload item details, photos, and location information
2. **Submit to Office** - Physically bring item to TracePoint office for verification
3. **Chat with Potential Owners** - Respond to messages from people who lost items
4. **Admin Coordination** - Admin handles claim verification and collection process

---

## 🧑💻 Tech Stack

### 🖥 Frontend
- ⚛️ **React** (Vite) - Modern React development
- 🎨 **Tailwind CSS** - Utility-first styling
- 💫 **Framer Motion** - Smooth animations
- 🔀 **React Router** - Client-side routing
- 🗂️ **Axios** - API communication
- 📱 **Responsive Design** - Mobile-first approach

### 🗄 Backend
- 🚀 **Node.js + Express** - Server framework
- 🧠 **MongoDB + Mongoose** - Database and ODM
- 🔐 **JWT Authentication** - Secure user sessions
- ☁️ **Cloudinary** - Image storage and optimization
- 💬 **Socket.IO** - Real-time chat functionality
- ✉️ **Nodemailer** - Email notifications
- 🛡️ **CORS & Security** - Cross-origin and security middleware

---

## 🧑💻 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Nakkkkkul0130/TracePoint
cd TracePoint
```

### 2️⃣ Setup Backend
```bash
cd Backend
npm install
```

### ➕ Create a .env file in /Backend with:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_USER=your_admin_username
ADMIN_PASS=your_admin_password

EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Start backend server:
```bash
npm run dev  # Uses nodemon for auto-restart
# or
node server.js
```

### 3️⃣ Setup Frontend
```bash
cd Frontend
npm install
npm run dev
```

---

## 🏢 TracePoint Collection Office

**Address:** TracePoint Office, Surya Nagar, Rohtak, Haryana  
**Contact:** +91 9728647308 | office@tracepoint.com  
**Hours:** Monday - Friday, 9:00 AM - 6:00 PM

---

## 🔐 Admin Access

Access the admin dashboard at `/admin/login` with your configured admin credentials.

**Admin Features:**
- View and manage all lost/found reports
- Verify office submissions
- Review and approve claim requests
- Monitor collection status
- Platform statistics and analytics

---

## 🌍 Live Deployment

**Component** | **URL**
--- | ---
🌐 Frontend | [https://tracepoint.vercel.app](https://tracepoint.vercel.app)
🚀 Backend | [https://tracepoint-usj3.onrender.com](https://tracepoint-usj3.onrender.com)

---

## 📁 Project Structure

```
TracePoint/
├── Frontend/
│   ├── src/
│   │   ├── Components/     # React components
│   │   ├── utils/         # Utility functions
│   │   └── context/       # React context
│   └── public/
├── Backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth & validation
│   └── server.js         # Entry point
└── README.md
```

---

## 🚀 Key Features Implemented

### 🔄 Verification Workflow
- **Lost Items:** Unique verification codes for secure claiming
- **Found Items:** Office submission requirement before claims
- **Admin Verification:** Manual review of all claim requests
- **Physical Collection:** Secure office-based item retrieval

### 💬 Real-time Communication
- **Socket.IO Integration:** Live chat between users
- **Message History:** Persistent conversation storage
- **Typing Indicators:** Real-time typing status
- **Claim Requests:** Structured claim messaging system

### 🛡️ Security & Authentication
- **JWT Tokens:** Secure user authentication
- **Session Management:** Browser-close logout detection
- **Admin Protection:** Separate admin authentication system
- **Input Validation:** Comprehensive data validation

### 📱 User Experience
- **Responsive Design:** Mobile-first, works on all devices
- **Dark/Light Theme:** User preference support
- **Smooth Animations:** Framer Motion integration
- **Intuitive Navigation:** Clear user flow and guidance
- **Loading Experience:** Engaging loading screen with tips and progress

---

## 🧾 License

This project is licensed under the **MIT License**.

MIT License

Copyright (c) 2025 Nakul Bhar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 👨💻 Author

Developed with ❤️ by:

**Nakul Bhar**  
🔗 GitHub: [@Nakkkkkul0130](https://github.com/Nakkkkkul0130)  
📧 Email: [nakulbhar13@gmail.com](mailto:nakulbhar13@gmail.com)  
🌐 LinkedIn: [Nakul Bhar](https://linkedin.com/in/nakul-bhar)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Nakkkkkul0130/TracePoint/issues).

## ⭐ Show your support

Give a ⭐️ if this project helped you!