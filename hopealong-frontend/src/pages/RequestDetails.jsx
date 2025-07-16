import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config/api.js";
import { authFetch } from "../utils/auth.js";

const RequestDetails = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    authFetch(`${API_BASE_URL}/api/riderequests/${id}`)
      .then(res => res.json())
      .then(data => setRequest(data.request));
  }, [id]);

  if (!request) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Ride Request Details</h2>
      <div className="mb-2 text-gray-700">
        <span className="font-semibold">User:</span> {request.user?.name}
      </div>
      <div className="mb-2 text-gray-700">
        <span className="font-semibold">Ride:</span> {request.ride?.from} → {request.ride?.to}
      </div>
      <div className="mb-2 text-gray-700">
        <span className="font-semibold">Seats Requested:</span> {request.seatsRequested}
      </div>
      <div className="mb-2 text-gray-700">
        <span className="font-semibold">Status:</span> {request.status}
      </div>
      <div className="mb-2 text-gray-700">
        <span className="font-semibold">Requested At:</span> {new Date(request.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default RequestDetails;