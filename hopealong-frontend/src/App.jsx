import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API_BASE_URL } from "./config/api.js";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateRide from "./pages/CreateRide.jsx";
import Rides from "./pages/Rides.jsx";
import EditRide from "./pages/EditRide.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GoodsDeliveries from "./pages/GoodsDeliveries.jsx";
import RideDetails from "./pages/RideDetails.jsx";
import CreateGoodsDelivery from "./pages/CreateGoodsDelivery.jsx";
import RequestDetails from "./pages/RequestDetails.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Profile from "./pages/Profile.jsx";
import ChatWindow from "./pages/ChatWindow.jsx";
import LiveTracking from "./pages/LiveTracking.jsx";
import Payment from "./pages/Payment.jsx";
import AboutUs from "./pages/AboutUs.jsx";

const socket = io(API_BASE_URL, { withCredentials: true });

const App = () => {
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    socket.on("message", (msg) => {
      setPopup(`${msg.sender}: ${msg.text}`);
      setTimeout(() => setPopup(null), 4000);
    });
    return () => socket.off("message");
  }, []);

  return (
    <>
      {popup && (
        <div className="fixed top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {popup}
        </div>
      )}
      <Navbar />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/aboutus" element={<AboutUs /> }/>
          <Route path="/rides" element={<Rides />} />
          <Route path="/goods-deliveries" element={<GoodsDeliveries />} />
          <Route path="/rides/:id" element={<RideDetails />} />
          <Route path="/requests/:id" element={<RequestDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat/:roomId" element={<ChatWindow />} />
          <Route path="/live-tracking/:rideId" element={<LiveTracking />} />
          <Route path="/payment/:rideId" element={<Payment />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-ride" element={<CreateRide />} />
            <Route path="/edit-ride/:id" element={<EditRide />} />
            <Route path="/create-goods-delivery" element={<CreateGoodsDelivery />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;

