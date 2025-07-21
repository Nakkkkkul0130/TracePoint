import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Features from "./Components/Features";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import { Login } from "./Components/Login";
import { Signup } from "./Components/Signup";
import { Testimonials } from "./Components/Testimonials";
import { Statistics } from "./Components/Statistics";
import ReportLost from "./Components/ReportLost";
import ViewFound from "./Components/ViewFound";
import About from "./Components/About";
import ChatRoom from "./Components/ChatRoom";

import AdminLogin from "./Components/AdminLogin";
import AdminDashboard from "./Components/AdminDashboard";
import Inbox from "./Components/Inbox";

function HomePage() {
  return (
    <>
      <div className="w-full bg-yellow-400 text-black py-2 overflow-hidden flex justify-center items-center">
        <p className="text-lg font-semibold animate-marquee">
          📢 New feature Coming soon: QR Code Tagging for lost & found items! | 🔥 Join our community today!
        </p>
      </div>

      <div id="home"><Hero /></div>
      <div id="features"><Features /></div>
      <div id="statistics"><Statistics /></div>
      <div id="testimonials"><Testimonials /></div>
      <div id="contact"><Contact /></div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/view-found" element={<ViewFound />} />
        <Route path="/about" element={<About />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chat/:itemId/:receiverId" element={<ChatRoom />} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/inbox" element={<Inbox />} />
      </Routes>
    </>
  );
}
