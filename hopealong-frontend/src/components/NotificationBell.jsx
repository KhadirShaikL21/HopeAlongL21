import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { API_BASE_URL } from "../config/api.js";
import { authFetch } from "../utils/auth.js";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    authFetch(`${API_BASE_URL}/api/notifications`)
      .then(res => res.json())
      .then(data => setNotifications(data.notifications || []))
      .catch(err => console.log('Failed to fetch notifications:', err));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-3 py-1 rounded-md shadow-md transition duration-200"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        <span>Alerts</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-2xl rounded-xl z-50 max-h-96 overflow-y-auto border border-indigo-200">
          <div className="p-4 border-b font-bold text-indigo-700 bg-indigo-50 rounded-t-xl">
            Notifications
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500">No notifications.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-4 border-b last:border-b-0 ${
                  n.read ? "bg-gray-50" : "bg-indigo-50"
                }`}
              >
                <div className="text-sm text-gray-900">{n.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
