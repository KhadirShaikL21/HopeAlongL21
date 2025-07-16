import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api.js";
import { authFetch } from "../utils/auth.js";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    authFetch(`${API_BASE_URL}/api/rides/${id}`)
      .then(res => res.json())
      .then(data => {
        setRide(data.ride || data);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    authFetch(`${API_BASE_URL}/api/auth/me`)
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!ride) return <div className="p-8 text-center">Ride not found.</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">
        {ride.from} → {ride.to}
      </h2>
      <div className="mb-2 text-gray-700">Date: {ride.date}</div>
      <div className="mb-2 text-gray-700">Time: {ride.time}</div>
      <div className="mb-2 text-gray-700">Seats Available: {ride.seatsAvailable}</div>
      <div className="mb-2 text-gray-700">Cost per Seat: ₹{ride.costPerSeat}</div>
      <div className="mb-2 text-gray-700">Vehicle: {ride.vehicleType}</div>
      <div className="mb-2 text-gray-700">Notes: {ride.notes}</div>
      {/* OTP only for user */}
      {ride.otp && user?.role === "user" && (
        <div className="my-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 rounded">
          <strong>Your Ride OTP:</strong> {ride.otp}
          <div className="text-xs text-gray-500">Share this OTP with your captain to start the ride.</div>
        </div>
      )}
      {/* Start Ride for captain */}
      {ride.status === "pending" && user?.role === "captain" && (
        <button
          className="mt-4 bg-blue-200 hover:bg-blue-300 text-black px-4 py-2 rounded"
          onClick={async () => {
            const otp = window.prompt("Enter OTP to start the ride:");
            if (!otp) return alert("OTP is required!");
            const res = await authFetch(`${API_BASE_URL}/api/rides/${ride._id}/start`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ otp }),
            });
            if (res.ok) {
              navigate(`/live-tracking/${ride._id}`);
            } else {
              const data = await res.json();
              alert(data.message || "Failed to start ride");
            }
          }}
        >
          Start Ride
        </button>
      )}
      {/* Complete Ride for captain */}
      {ride.status === "started" && user?.role === "captain" && (
        <button
          className="mt-4 bg-green-200 hover:bg-green-300 text-black px-4 py-2 rounded"
          onClick={async () => {
            await authFetch(`${API_BASE_URL}/api/rides/${ride._id}/complete`, {
              method: "POST",
            });
            navigate(`/payment/${ride._id}`);
          }}
        >
          Complete Ride
        </button>
      )}
    </div>
  );
};

export default RideDetails;