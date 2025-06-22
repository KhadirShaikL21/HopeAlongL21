import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaSearch, 
  FaUser, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaCar, 
  FaMoneyBillWave, 
  FaUsers,
  FaStar,
  FaRegStar,
  FaChevronRight
} from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { motion } from "framer-motion";

const Rides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => JSON.parse(localStorage.getItem("rideSearch")) || { from: "", to: "", date: "" });
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("departure");

  const fetchRides = async (params = {}) => {
    setLoading(true);
    let query = Object.entries(params)
      .filter(([k, v]) => v)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    const url = query
      ? `http://localhost:5000/api/rides/search?${query}`
      : "http://localhost:5000/api/rides";
    const res = await fetch(url);
    const data = await res.json();
    setRides(data.rides || data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRides(search);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.from && !search.to && !search.date) {
      alert("Please enter at least one search field.");
      return;
    }
    localStorage.setItem("rideSearch", JSON.stringify(search));
    fetchRides(search);
  };

  const handleRequest = async (rideId) => {
    const seatsRequested = window.prompt("How many seats do you want to book?");
    if (!seatsRequested) return;
    const res = await fetch("http://localhost:5000/api/riderequests/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ rideId, seatsRequested }),
    });
    const data = await res.json();
    alert(data.msg);
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(+hours);
    date.setMinutes(+minutes);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getRandomRating = () => (Math.random() * 2 + 3).toFixed(1);

  const sortRides = (ridesToSort) => {
    const sortedRides = [...ridesToSort];
    
    switch(sortBy) {
      case "departure":
        // Sort by date and time
        sortedRides.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA - dateB;
        });
        break;
        
      case "price-low":
        // Sort by price low to high
        sortedRides.sort((a, b) => a.costPerSeat - b.costPerSeat);
        break;
        
      case "price-high":
        // Sort by price high to low
        sortedRides.sort((a, b) => b.costPerSeat - a.costPerSeat);
        break;
        
      case "rating":
        // Sort by rating (using the random rating function)
        sortedRides.sort((a, b) => {
          const ratingA = parseFloat(getRandomRating());
          const ratingB = parseFloat(getRandomRating());
          return ratingB - ratingA; // Highest first
        });
        break;
        
      default:
        // No sorting
        break;
    }
    
    return sortedRides;
  };

  useEffect(() => {
    if (rides.length > 0) {
      setRides(sortRides([...rides]));
    }
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Find Your Perfect Ride
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with trusted drivers and passengers for convenient, affordable rides.
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-100"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="flex flex-col items-center">
                  <FaMapMarkerAlt className="text-indigo-500 mb-1" />
                  <div className="w-0.5 h-4 bg-gray-300"></div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Leaving from..."
                value={search.from}
                onChange={e => setSearch({ ...search, from: e.target.value })}
                className="pl-10 py-3 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-300 transition"
                aria-label="From location"
              />
            </div>
            <div className="relative col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-red-500" />
              </div>
              <input
                type="text"
                placeholder="Going to..."
                value={search.to}
                onChange={e => setSearch({ ...search, to: e.target.value })}
                className="pl-10 py-3 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-300 transition"
                aria-label="To location"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-500" />
              </div>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={search.date}
                onChange={e => setSearch({ ...search, date: e.target.value })}
                className="pl-10 py-3 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-300 transition"
                aria-label="Date"
              />
            </div>
            <div className="md:col-span-4 flex space-x-3 overflow-x-auto pb-2">
              {["all", "today", "tomorrow", "weekend"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold rounded-xl py-3 px-6 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
              <FaSearch className="mr-2" /> Search Rides
            </button>
          </form>
        </motion.div>

        {/* Results Count */}
        {!loading && rides.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {rides.length} {rides.length === 1 ? 'Ride' : 'Rides'} Available
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">Sort by:</span>
              <select 
                className="bg-white border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="departure">Departure Time</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-64"
            role="status"
          >
            <div className="flex flex-col items-center">
              <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Finding the best rides for you...</p>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && rides.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-2xl mx-auto"
          >
            <div className="w-40 h-40 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-5xl text-indigo-400">🚗</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No rides matching your search</h2>
            <p className="text-gray-500 mb-6">Try adjusting your filters or be the first to offer a ride on this route!</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setSearch({ from: "", to: "", date: "" });
                  localStorage.removeItem("rideSearch");
                }}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50 transition"
              >
                Clear Filters
              </button>
              <Link
                to="/create-ride"
                className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition flex items-center"
              >
                <FaCar className="mr-2" /> Offer a Ride
              </Link>
            </div>
          </motion.div>
        )}

        {/* Rides List */}
        {!loading && rides.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-6"
          >
            {sortRides(rides).map((ride, index) => (
              <motion.div
                key={ride._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Ride Info */}
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                          <FaCar className="text-indigo-600 text-xl" />
                        </div>
                        <div>
                          <Link 
                            to={`/rides/${ride._id}`} 
                            className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition flex items-center"
                          >
                            {ride.from} <FaChevronRight className="mx-1 text-gray-400 text-sm" /> {ride.to}
                          </Link>
                          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                            <div className="flex items-center text-gray-600">
                              <IoTime className="mr-2 text-indigo-400" />
                              <span>{ride.date} • {formatTime(ride.time)}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FaUsers className="mr-2 text-indigo-400" />
                              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                {ride.seatsAvailable} seats left
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FaMoneyBillWave className="mr-2 text-indigo-400" />
                              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                ₹{ride.costPerSeat}/seat
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Driver & Action */}
                    <div className="mt-4 md:mt-0 md:ml-6 md:text-right">
                      <div className="flex md:flex-col items-center md:items-end mb-3">
                        <div className="flex items-center mr-3 md:mr-0 md:mb-2">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                            <FaUser className="text-indigo-600" />
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">{ride.captain?.name}</div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                i < Math.floor(getRandomRating()) ? 
                                  <FaStar key={i} className="text-yellow-400 text-xs" /> : 
                                  <FaRegStar key={i} className="text-yellow-400 text-xs" />
                              ))}
                              <span className="ml-1 text-gray-500 text-xs">{getRandomRating()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRequest(ride._id)}
                        className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-all shadow-sm hover:shadow-md"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Rides;