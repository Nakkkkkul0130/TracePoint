const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const connectDB = require("./db");
const LoginauthRoutes = require("./LoginauthRoutes");
const emailRoutes = require("./emailService"); // ✅ it's a router!

const app = express();
connectDB();

app.use(cors({
  origin: "https://trace-point.vercel.app", // for testing, allow all origins
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use routers
app.use("/auth", LoginauthRoutes);
app.use("/", emailRoutes); // ✅ Mounts /send-email properly

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
