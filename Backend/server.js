const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http");
require("dotenv").config();

const { Server } = require("socket.io");
const connectDB = require("./db");

const authRoutes = require("./LoginauthRoutes");
const emailRoutes = require("./emailService");
const reportLostRoutes = require("./reportLostRoutes");
const foundItemRoutes = require("./foundItemRoutes");
const adminRoutes = require("./adminRoutes");
const messageRoutes = require("./messageRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "https://trace-point.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || "https://trace-point.vercel.app",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);             // Login, signup, verify-token
app.use("/email", emailRoutes);           // Email service
app.use("/lost", reportLostRoutes);           
app.use("/view-found", foundItemRoutes);  
app.use("/admin", adminRoutes);                
app.use(messageRoutes);                   

app.get("/", (req, res) => {
  res.send(" TracePoint Server is running with cookies + socket.io");
});

app.use((err, req, res, next) => {
  console.error("🔥 Error Middleware Triggered:");
  console.error("Error Message:", err.message);
  console.error("Error Stack:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});


io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`🏠 User joined room: ${roomId}`);
  });

  socket.on("sendMessage", (message) => {
    const roomId = message.itemId;
    io.to(roomId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("🚪 Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
