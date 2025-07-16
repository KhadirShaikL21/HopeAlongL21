import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext.jsx";
import { LogIn, LogOut } from "lucide-react";
import { API_BASE_URL } from "../config/api.js";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    logout();
    navigate("/login");
  };

  const navLinkBase =
    "font-semibold text-sm px-3 py-2 rounded-md transition duration-200";
  const activeLink = "bg-indigo-100 text-indigo-700";
  const inactiveLink = "text-indigo-700 hover:bg-indigo-50";

  return (
    <nav className="bg-white shadow-md z-50 relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Nav Items */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-2xl font-extrabold text-indigo-700 tracking-wide drop-shadow-md"
          >
            HopeAlong
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/rides"
              className={`${navLinkBase} ${
                location.pathname.startsWith("/rides")
                  ? activeLink
                  : inactiveLink
              }`}
            >
              Rides
            </Link>
            <Link
              to="/goods-deliveries"
              className={`${navLinkBase} ${
                location.pathname.startsWith("/goods-deliveries")
                  ? activeLink
                  : inactiveLink
              }`}
            >
              Goods
            </Link>
            <Link
              to="/dashboard"
              className={`${navLinkBase} ${
                location.pathname.startsWith("/dashboard")
                  ? activeLink
                  : inactiveLink
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`${navLinkBase} ${
                location.pathname.startsWith("/profile")
                  ? activeLink
                  : inactiveLink
              }`}
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Notification + Login/Logout */}
        <div className="flex items-center gap-4">
          <NotificationBell />
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm px-2.5 py-1 rounded-md shadow transition duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-2.5 py-1 rounded-md shadow transition duration-200"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
