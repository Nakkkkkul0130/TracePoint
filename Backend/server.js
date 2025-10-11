const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http");
require("dotenv").config();

const { Server } = require("socket.io");
const connectDB = require("./db");

// Import routes
const authRoutes = require("./LoginauthRoutes");
const emailRoutes = require("./emailService");
const reportLostRoutes = require("./reportLostRoutes");
const foundItemRoutes = require("./foundItemRoutes");
const foundRoutes = require("./routes/foundRoutes");
const adminRoutes = require("./adminRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000", 
  "https://trace-point.vercel.app",
  "https://tracepoint.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

connectDB();

app.use(cors({
  origin: allowedOrigins,
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
app.use("/found", foundRoutes);
app.use("/", adminRoutes);                
app.use(messageRoutes);                   

app.get("/", (req, res) => {
  res.send(" TracePoint Server is running with cookies + socket.io");
});

app.use((err, req, res, next) => {
  console.error(" Error Middleware Triggered:");
  if (err instanceof Error) {
    console.error("Error Message:", err.message);
    console.error("Error Stack:", err.stack);
  } else {
    console.error("Unknown error:", err);
  }

  res.status(500).json({
    message: "Internal Server Error",
    error: err?.message || "Unknown server error",
  });
});



io.on("connection", (socket) => {
  console.log(" Socket connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(` User joined room: ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(` User left room: ${roomId}`);
  });

  socket.on("sendMessage", (message) => {
    const roomId = message.itemId;
    socket.to(roomId).emit("receiveMessage", message);
  });

  socket.on("typing", ({ itemId, userId, isTyping }) => {
    socket.to(itemId).emit("userTyping", { userId, isTyping });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
