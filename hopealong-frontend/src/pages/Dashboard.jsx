import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

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

      try {
        if (user.role === "captain") {
          const [ridesRes, rideReqRes, goodsRes, goodsReqRes] = await Promise.all([
            fetch("http://localhost:5000/api/rides/my-offered", { credentials: "include" }),
            fetch("http://localhost:5000/api/riderequests/captain", { credentials: "include" }),
            fetch("http://localhost:5000/api/goods", { credentials: "include" }),
            fetch("http://localhost:5000/api/goods-requests/captain", { credentials: "include" })
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
            fetch("http://localhost:5000/api/riderequests/my-requests", { credentials: "include" }),
            fetch("http://localhost:5000/api/goods-requests/user", { credentials: "include" })
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
      const res = await fetch(`http://localhost:5000/api/riderequests/respond/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
      const res = await fetch(`http://localhost:5000/api/goods-requests/${requestId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
      const res = await fetch(`http://localhost:5000/api/rides/${rideId}`, {
        method: "DELETE",
        credentials: "include",
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="mt-2 text-red-700 hover:text-red-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-white/90 rounded-3xl shadow-xl p-8 mb-8 flex flex-col items-center">
          <div className="text-3xl font-extrabold text-indigo-700 mb-2">
            Welcome, {user.name}
          </div>
          <div className="text-gray-600 mb-1">{user.email}</div>
          <div className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
            Role: {user.role}
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => setShowType("rides")}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              showType === "rides" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border"
            }`}
          >
            Rides
          </button>
          <button
            onClick={() => setShowType("goods")}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              showType === "goods" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border"
            }`}
          >
            Goods
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
    <li className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <div className="font-semibold text-indigo-600">
          <Link to={`/rides/${ride._id}`} className="hover:underline">
            {ride.from} → {ride.to}
          </Link>
        </div>
        <div className="text-gray-600 text-sm">{ride.date} at {ride.time}</div>
        <div className="text-gray-500 text-xs">
          Seats: {ride.seatsAvailable} | Price: ₹{ride.costPerSeat}
        </div>
      </div>
      {isCaptain && (
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this ride?")) {
                onDelete(ride._id);
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            Delete
          </button>
          <Link
            to={`/edit-ride/${ride._id}`}
            className="bg-blue-200 hover:bg-blue-300 text-black px-3 py-1 rounded-lg text-sm font-bold shadow"
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
    <li className="border rounded-xl p-4">
      <div className="font-semibold">
        {request.user?.name} requested {request.seatsRequested} seat(s) for {request.ride?.from} → {request.ride?.to}
      </div>
      <div className="text-gray-600 text-sm">Status: <span className={
        request.status === 'approved' ? 'text-green-600' : 
        request.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
      }>{request.status}</span></div>
      
      {request.status === "pending" && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onRespond(request._id, "approved")}
            className="bg-green-200 hover:bg-green-300 text-black px-3 py-1 rounded-lg text-sm font-bold shadow"
          >
            Approve
          </button>
          <button
            onClick={() => onRespond(request._id, "rejected")}
            className="bg-red-200 hover:bg-red-300 text-black px-3 py-1 rounded-lg text-sm font-bold shadow"
          >
            Reject
          </button>
        </div>
      )}
      
      {request.status === "approved" && (
        <Link
          to={`/chat/${request._id}`}
          className="inline-block bg-indigo-200 hover:bg-indigo-300 text-black px-3 py-1 rounded-lg text-sm font-bold shadow mt-2"
        >
          Chat
        </Link>
      )}
    </li>
  );
};

// Component for displaying a user's booking
const BookingItem = ({ booking }) => {
  return (
    <li className="border rounded-xl p-4">
      <div className="font-semibold">{booking.ride?.from} → {booking.ride?.to}</div>
      <div className="text-gray-600 text-sm">{booking.ride?.date} at {booking.ride?.time}</div>
      <div className="text-gray-500 text-xs">
        Seats: {booking.seatsRequested} | Status: <span className={
          booking.status === 'approved' ? 'text-green-600' : 
          booking.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
        }>{booking.status}</span>
      </div>
      
      {booking.ride?.otp && (
        <div className="my-2 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 rounded text-sm">
          <strong>OTP:</strong> {booking.ride.otp}
        </div>
      )}
      
      {booking.status === "approved" && (
        <Link
          to={`/chat/${booking._id}`}
          className="inline-block bg-indigo-200 hover:bg-indigo-300 text-black px-3 py-1 rounded-lg text-sm font-bold shadow mt-2"
        >
          Chat
        </Link>
      )}
    </li>
  );
};

// Component for displaying a goods delivery
const GoodsDeliveryItem = ({ delivery }) => {
  return (
    <li className="border rounded-xl p-4">
      <div className="font-semibold text-indigo-600">
        {delivery.from} → {delivery.to}
      </div>
      <div className="text-gray-600 text-sm">{delivery.date} at {delivery.time}</div>
      <div className="text-gray-500 text-xs">
        Vehicle: {delivery.vehicleType} | Capacity: {delivery.capacity}
      </div>
    </li>
  );
};

// Component for displaying a goods request
const GoodsRequestItem = ({ request, onRespond, isUser }) => {
  return (
    <li className="border rounded-xl p-4">
      <div className="font-semibold">
        {!isUser && `${request.user?.name} requested delivery for `}
        {request.delivery?.from} → {request.delivery?.to}
      </div>
      <div className="text-gray-600 text-sm">
        Status: <span className={
          request.status === 'approved' ? 'text-green-600' : 
          request.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
        }>{request.status}</span>
      </div>
      <div className="text-gray-500 text-xs">Item: {request.itemDetails}</div>
      
      {!isUser && request.status === "pending" && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onRespond(request._id, "approved")}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
          >
            Approve
          </button>
          <button
            onClick={() => onRespond(request._id, "rejected")}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
          >
            Reject
          </button>
        </div>
      )}
    </li>
  );
};

export default Dashboard;