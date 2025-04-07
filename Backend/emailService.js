require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const validator = require("validator");
const ContactMessage = require("./contactMessage");

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post("/send-email", async (req, res) => {
  let { name, email, message } = req.body;

  // ✅ Sanitize inputs
  const cleanName = validator.escape(name);
  const cleanEmail = validator.normalizeEmail(email);
  const cleanMessage = validator.escape(message);

  // ✅ Validate email format (after normalization)
  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  if (!validator.isEmail(cleanEmail)) {
    return res.status(400).json({ error: "Invalid email format!" });
  }

  try {
    // ✅ Save sanitized message to DB
    const newMessage = new ContactMessage({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });
    await newMessage.save();

    // ✅ Email to site owner (you)
    await transporter.sendMail({
      from: cleanEmail,
      to: process.env.EMAIL,
      subject: `New Contact Form Submission from ${cleanName}`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\nMessage: ${cleanMessage}`,
    });

    // ✅ Confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: cleanEmail,
      subject: "Thank you for contacting us!",
      text: `Hi ${cleanName},\n\nWe received your message:\n"${cleanMessage}"\n\nWe’ll get back to you shortly.\n\nRegards,\nTeam`,
    });

    res.json({ message: "Message sent and confirmation email delivered!" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ error: "Something went wrong. Try again later." });
  }
});

module.exports = router;
