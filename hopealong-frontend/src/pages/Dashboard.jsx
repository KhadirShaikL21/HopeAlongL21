import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api.js";
import { authFetch } from "../utils/auth.js";
import { debugAuth } from "../utils/debugAuth.js";

const Dashboard = () => {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [offeredRides, setOfferedRides] = useState([]);
  const [rideRequests, setRideRequests] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [goodsDeliveries, setGoodsDeliveries] = useState([]);
  const [goodsRequests, setGoodsRequests] = useState([]);
  const [goodsUserRequests, setGoodsUserRequests] = useState([]);
  const [showType, setShowType] = useState("rides");
  const [error, setError] = useState(null);

  // 1. Always refresh user on mount if not present
  useEffect(() => {
    if (!user && !authLoading) {
      refreshUser();
    }
    // eslint-disable-next-line
  }, [user, authLoading]);

  // 2. Only fetch dashboard data when user is loaded
  useEffect(() => {
    if (!user || authLoading) return;
    const fetchDashboardData = async () => {
      setDataLoading(true);
      setError(null);

      console.log('🔍 Dashboard: Starting data fetch...');
      console.log('User role:', user?.role);
      debugAuth();

      try {
        if (user.role === "captain") {
          console.log('📡 Fetching captain data...');
          const [ridesRes, rideReqRes, goodsRes, goodsReqRes] = await Promise.all([
            authFetch(`${API_BASE_URL}/api/rides/my-offered`),
            authFetch(`${API_BASE_URL}/api/riderequests/captain`),
            authFetch(`${API_BASE_URL}/api/goods`),
            authFetch(`${API_BASE_URL}/api/goods-requests/captain`)
          ]);

          const [rides, rideRequestsData, goodsData, goodsReqData] = await Promise.all([
            ridesRes.json(),
            rideReqRes.json(),
            goodsRes.json(),
            goodsReqRes.json()
          ]);

          if (!ridesRes.ok) throw new Error(rides.message || 'Failed to fetch rides');
          if (!rideReqRes.ok) throw new Error(rideRequestsData.message || 'Failed to fetch ride requests');
          if (!goodsRes.ok) throw new Error(goodsData.message || 'Failed to fetch goods deliveries');
          if (!goodsReqRes.ok) throw new Error(goodsReqData.message || 'Failed to fetch goods requests');

          setOfferedRides(rides);
          setRideRequests(rideRequestsData.requests || []);
          setGoodsDeliveries(goodsData.deliveries?.filter(d => d.captain?._id === user._id || d.captain === user._id) || []);
          setGoodsRequests(goodsReqData.requests || []);
        } else {
          const [bookingsRes, goodsUserReqRes] = await Promise.all([
            authFetch(`${API_BASE_URL}/api/riderequests/my-requests`),
            authFetch(`${API_BASE_URL}/api/goods-requests/user`)
          ]);

          const [bookingsData, goodsUserReqData] = await Promise.all([
            bookingsRes.json(),
            goodsUserReqRes.json()
          ]);

          if (!bookingsRes.ok) throw new Error(bookingsData.message || 'Failed to fetch bookings');
          if (!goodsUserReqRes.ok) throw new Error(goodsUserReqData.message || 'Failed to fetch goods requests');

          setMyBookings(bookingsData.requests || []);
          setGoodsUserRequests(goodsUserReqData.requests || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        console.error("Dashboard error:", err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
    // eslint-disable-next-line
  }, [user, authLoading]);

  const handleRespond = async (requestId, status) => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/riderequests/respond/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update request');

      setRideRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status } : req
      ));
    } catch (err) {
      setError(err.message || 'Failed to update ride request');
    }
  };

  const handleGoodsRequestRespond = async (requestId, status) => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/goods-requests/${requestId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update goods request');

      if (user.role === "captain") {
        setGoodsRequests(prev => prev.map(req => 
          req._id === requestId ? { ...req, status } : req
        ));
      } else {
        setGoodsUserRequests(prev => prev.map(req => 
          req._id === requestId ? { ...req, status } : req
        ));
      }
    } catch (err) {
      setError(err.message || 'Failed to update goods request');
    }
  };

  const deleteRide = async (rideId) => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/rides/${rideId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete ride');

      setOfferedRides(prev => prev.filter(r => r._id !== rideId));
    } catch (err) {
      setError(err.message || 'Failed to delete ride');
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
        <div className="text-xl text-indigo-600 font-semibold">Loading Dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
        <div className="text-xl text-indigo-600 font-semibold">Please login to view dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 py-10 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl shadow flex flex-col items-start">
            <p className="font-semibold">{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="mt-2 text-red-700 hover:text-red-900 underline text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-white/90 rounded-3xl shadow-xl p-8 mb-8 flex flex-col items-center border border-indigo-100">
          <div className="text-3xl font-extrabold text-indigo-700 mb-2 flex items-center gap-2">
            <span>Welcome, {user.name}</span>
          </div>
          <div className="text-gray-600 mb-1">{user.email}</div>
          <div className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm mt-1">
            Role: {user.role}
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setShowType('rides')}
            className={`px-6 py-2 rounded-xl font-semibold transition shadow border-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base
              ${showType === 'rides' ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white border-indigo-600 scale-105' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 13l2-2m0 0l7-7 7 7M5 11v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
              Rides
            </span>
          </button>
          <button
            onClick={() => setShowType('goods')}
            className={`px-6 py-2 rounded-xl font-semibold transition shadow border-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base
              ${showType === 'goods' ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white border-indigo-600 scale-105' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 13V7a2 2 0 00-2-2h-4V3a1 1 0 00-1-1h-2a1 1 0 00-1 1v2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2h-4v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2H6a2 2 0 01-2-2v-6" /></svg>
              Goods
            </span>
          </button>
        </div>

        {/* Content based on selection */}
        {showType === "rides" ? (
          <>
            {/* Captain's Ride Section */}
            {user.role === "captain" && (
              <>
                <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-indigo-700">My Offered Rides</h2>
                    <Link
                      to="/create-ride"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-xl text-sm font-semibold"
                    >
                      Create Ride
                    </Link>
                  </div>
                  
                  {offeredRides.length === 0 ? (
                    <div className="text-gray-500">No rides offered yet.</div>
                  ) : (
                    <ul className="space-y-4">
                      {offeredRides.map((ride) => (
                        <RideItem 
                          key={ride._id} 
                          ride={ride} 
                          onDelete={deleteRide} 
                          isCaptain={true}
                        />
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8">
                  <h2 className="text-xl font-bold text-indigo-700 mb-4">Ride Requests</h2>
                  {rideRequests.length === 0 ? (
                    <div className="text-gray-500">No ride requests yet.</div>
                  ) : (
                    <ul className="space-y-4">
                      {rideRequests.map((req) => (
                        <RideRequestItem 
                          key={req._id} 
                          request={req} 
                          onRespond={handleRespond} 
                        />
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}

            {/* User's Ride Section */}
            {user.role === "user" && (
              <>
                <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-indigo-700">My Bookings</h2>
                    <Link
                      to="/rides"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-xl text-sm font-semibold"
                    >
                      Find a Ride
                    </Link>
                  </div>
                  
                  {myBookings.length === 0 ? (
                    <div className="text-gray-500">No bookings yet.</div>
                  ) : (
                    <ul className="space-y-4">
                      {myBookings.map((booking) => (
                        <BookingItem key={booking._id} booking={booking} />
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {/* Captain's Goods Section */}
            {user.role === "captain" && (
              <>
                <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-indigo-700">My Goods Deliveries</h2>
                    <Link
                      to="/create-goods-delivery"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-xl text-sm font-semibold"
                    >
                      Create Delivery
                    </Link>
                  </div>
                  
                  {goodsDeliveries.length === 0 ? (
                    <div className="text-gray-500">No goods deliveries offered yet.</div>
                  ) : (
                    <ul className="space-y-4">
                      {goodsDeliveries.map((delivery) => (
                        <GoodsDeliveryItem key={delivery._id} delivery={delivery} />
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8">
                  <h2 className="text-xl font-bold text-indigo-700 mb-4">Goods Requests</h2>
                  {goodsRequests.length === 0 ? (
                    <div className="text-gray-500">No goods requests yet.</div>
                  ) : (
                    <ul className="space-y-4">
                      {goodsRequests.map((req) => (
                        <GoodsRequestItem 
                          key={req._id} 
                          request={req} 
                          onRespond={handleGoodsRequestRespond} 
                        />
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}

            {/* User's Goods Section */}
            {user.role === "user" && (
              <>
                <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-indigo-700">My Goods Requests</h2>
                    <Link
                      to="/goods-deliveries"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-xl text-sm font-semibold"
                    >
                      Find Delivery
                    </Link>
                  </div>
                  
                  {goodsUserRequests.length === 0 ? (
                    <div className="text-gray-500">No goods requests yet.</div>
                  ) : (
                    <ul className="space-y-4">
                      {goodsUserRequests.map((req) => (
                        <GoodsRequestItem 
                          key={req._id} 
                          request={req} 
                          isUser={true}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Component for displaying a single ride item
const RideItem = ({ ride, onDelete, isCaptain }) => {
  return (
    <li className="bg-white rounded-2xl shadow border border-blue-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-lg transition-all">
      <div className="flex-1 flex flex-col gap-1">
        <div className="font-bold text-indigo-700 text-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243M15 11V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-4" /></svg>
          <Link to={`/rides/${ride._id}`} className="hover:underline">
            {ride.from} <span className="mx-1">→</span> {ride.to}
          </Link>
        </div>
        <div className="flex items-center gap-3 text-gray-500 text-sm mt-1">
          <span className="inline-flex items-center gap-1">{ride.date ? ride.date.split('T')[0] : ''}</span>
          <span className="inline-flex items-center gap-1">Arrival: {ride.deliveryTime || ride.time}</span>
          {ride.departureTime && (
            <span className="inline-flex items-center gap-1">Departure: {ride.departureTime}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-xs mt-2">
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold">Seats: {ride.seatsAvailable}</span>
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold">₹{ride.costPerSeat}</span>
        </div>
      </div>
      {isCaptain && (
        <div className="flex flex-col gap-2 min-w-[100px] items-end">
          <button
            onClick={() => { if (window.confirm('Are you sure you want to delete this ride?')) { onDelete(ride._id); } }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow"
          >
            Delete
          </button>
          <Link
            to={`/edit-ride/${ride._id}`}
            className="bg-blue-100 hover:bg-blue-200 text-indigo-700 px-3 py-1 rounded-lg text-sm font-bold shadow"
          >
            Edit
          </Link>
        </div>
      )}
    </li>
  );
};

// Component for displaying a ride request
const RideRequestItem = ({ request, onRespond }) => {
  return (
    <li className="bg-white rounded-2xl shadow border border-blue-100 p-5 flex flex-col gap-2 hover:shadow-lg transition-all">
      <div className="font-semibold text-indigo-700 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
        {request.user?.name} requested {request.seatsRequested} seat(s) for {request.ride?.from} <span className="mx-1">→</span> {request.ride?.to}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className={`px-3 py-1 rounded-full font-semibold text-xs ${
          request.status === 'approved' ? 'bg-green-100 text-green-700' :
          request.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {request.status}
        </span>
      </div>
      {request.status === "pending" && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onRespond(request._id, "approved")}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow"
          >
            Approve
          </button>
          <button
            onClick={() => onRespond(request._id, "rejected")}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow"
          >
            Reject
          </button>
        </div>
      )}
      {request.status === "approved" && (
        <Link
          to={`/chat/${request._id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ minWidth: '80px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2" />
            <path d="M15 3h-6a2 2 0 00-2 2v2a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2z" />
          </svg>
          Chat
        </Link>
      )}
    </li>
  );
};

// Component for displaying a user's booking
const BookingItem = ({ booking }) => {
  return (
    <li className="bg-white rounded-2xl shadow border border-blue-100 p-5 flex flex-col gap-2 hover:shadow-lg transition-all">
      <div className="font-semibold text-indigo-700 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243M15 11V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-4" /></svg>
        {booking.ride?.from} <span className="mx-1">→</span> {booking.ride?.to}
      </div>
      <div className="flex items-center gap-3 text-gray-500 text-sm mt-1">
        <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{booking.ride?.date ? booking.ride.date.split('T')[0] : ''}</span>
        <span className="inline-flex items-center gap-1">  {booking.ride?.time}-{booking.ride?.departureTime} </span>
      </div>
      <div className="flex flex-wrap gap-3 text-xs mt-2">
        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold">Seats: {booking.seatsRequested}</span>
        <span className={`px-3 py-1 rounded-full font-semibold text-xs ${
          booking.status === 'approved' ? 'bg-green-100 text-green-700' :
          booking.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {booking.status}
        </span>
      </div>
      {booking.ride?.otp && (
        <div className="my-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 rounded text-xs flex items-center gap-2">
          <strong>OTP:</strong> {booking.ride.otp}
        </div>
      )}
      {booking.status === "approved" && (
        <Link
          to={`/chat/${booking._id}`}
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow mt-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ml-0"
          style={{ minWidth: '110px', justifyContent: 'flex-start' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2" /><path d="M15 3h-6a2 2 0 00-2 2v2a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2z" /></svg>
          Chat
        </Link>
      )}
    </li>
  );
};

// Component for displaying a goods delivery
const GoodsDeliveryItem = ({ delivery }) => {
  return (
    <li className="bg-white rounded-2xl shadow border border-blue-100 p-5 flex flex-col gap-2 hover:shadow-lg transition-all">
      <div className="font-bold text-indigo-700 text-lg flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17v-6a2 2 0 012-2h6a2 2 0 012 2v6M9 17H5a2 2 0 01-2-2v-6a2 2 0 012-2h4m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>
        {delivery.from} <span className="mx-1">→</span> {delivery.to}
      </div>
      <div className="flex items-center gap-3 text-gray-500 text-sm mt-1">
        <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{delivery.date}</span>
        <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /></svg>{delivery.time}</span>
      </div>
      <div className="flex flex-wrap gap-3 text-xs mt-2">
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">Vehicle: {delivery.vehicleType}</span>
        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold">Capacity: {delivery.capacity}</span>
      </div>
    </li>
  );
};

// Component for displaying a goods request
const GoodsRequestItem = ({ request, onRespond, isUser }) => {
  return (
    <li className="bg-white rounded-2xl shadow border border-blue-100 p-5 flex flex-col gap-2 hover:shadow-lg transition-all">
      <div className="font-semibold text-indigo-700 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17v-6a2 2 0 012-2h6a2 2 0 012 2v6M9 17H5a2 2 0 01-2-2v-6a2 2 0 012-2h4m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>
        {!isUser && `${request.user?.name} requested delivery for `}
        {request.delivery?.from} <span className="mx-1">→</span> {request.delivery?.to}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className={`px-3 py-1 rounded-full font-semibold text-xs ${
          request.status === 'approved' ? 'bg-green-100 text-green-700' :
          request.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {request.status}
        </span>
      </div>
      <div className="text-gray-500 text-xs">Item: {request.itemDetails}</div>
      {!isUser && request.status === "pending" && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onRespond(request._id, "approved")}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow"
          >
            Approve
          </button>
          <button
            onClick={() => onRespond(request._id, "rejected")}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow"
          >
            Reject
          </button>
        </div>
      )}
    </li>
  );
};

export default Dashboard;