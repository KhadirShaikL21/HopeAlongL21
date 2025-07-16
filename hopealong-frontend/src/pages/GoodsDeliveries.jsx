import React, { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "../config/api.js";
import { 
  FaTruck, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaBoxOpen,
  FaSearch,
  FaArrowRight,
  FaRegStar,
  FaStar,
  FaBell,
  FaMoneyBillWave
} from "react-icons/fa";
import { motion } from "framer-motion";
import { IoMdArrowRoundForward } from "react-icons/io";
import axios from "axios";

const GEO_API_KEY = "df8a98a451mshcf053dbb1d0a300p1316b6jsnc5fc3d394c49";
const GEO_API_HOST = "wft-geo-db.p.rapidapi.com";

const fetchCitySuggestions = async (query) => {
  if (!query) return [];
  try {
    const res = await axios.get(
      `https://${GEO_API_HOST}/v1/geo/cities?namePrefix=${encodeURIComponent(query)}&limit=5&types=CITY`,
      {
        headers: {
          "X-RapidAPI-Key": GEO_API_KEY,
          "X-RapidAPI-Host": GEO_API_HOST,
        },
      }
    );
    return res.data.data.map((city) => city.city);
  } catch (error) {
    return [];
  }
};

const GoodsDeliveries = () => {
  const [allDeliveries, setAllDeliveries] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [search, setSearch] = useState({ from: "", to: "", date: "" });
  const [filters, setFilters] = useState({
    vehicleType: "",
    price: 2000,
    date: "",
    capacity: 1,
  });
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const fromInputRef = useRef();
  const toInputRef = useRef();

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/goods`);
        const data = await res.json();
        const withRatings = (data.deliveries || []).map((d) => ({
          ...d,
          rating: +(Math.random() * 2 + 3).toFixed(1)
        }));
        setAllDeliveries(withRatings);
        setDeliveries(withRatings);
        setFilteredDeliveries(withRatings);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    let filtered = allDeliveries.filter((d) => {
      const fromMatch = d.from.toLowerCase().includes(search.from.toLowerCase());
      const toMatch = d.to.toLowerCase().includes(search.to.toLowerCase());
      const dateMatch = search.date ? d.date === search.date : true;
      return fromMatch && toMatch && dateMatch;
    });
    setDeliveries(filtered);
    setFilteredDeliveries(filtered);
  };

  // Filter handler
  const applyFilters = (e) => {
    if (e) e.preventDefault();
    let filtered = deliveries.filter((d) => {
      let match = true;
      if (filters.price && d.price > Number(filters.price)) match = false;
      if (filters.date && d.date !== filters.date) match = false;
      if (filters.capacity) {
        if (filters.capacity === "small" && d.availableCapacity !== "small") match = false;
        if (filters.capacity === "medium" && d.availableCapacity !== "medium") match = false;
        if (filters.capacity === "large" && d.availableCapacity !== "large") match = false;
      }
      return match;
    });
    setFilteredDeliveries(filtered);
  };

  // Reset filteredDeliveries when deliveries change
  useEffect(() => {
    setFilteredDeliveries(deliveries);
  }, [deliveries]);

  // Request handler
  const handleRequest = async (deliveryId) => {
    setRequestingId(deliveryId);
    const itemDetails = window.prompt("Enter item details for delivery:");
    if (!itemDetails) {
      setRequestingId(null);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/goods-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ deliveryId, itemDetails }),
      });
      const data = await res.json();
      alert(data.msg);
    } catch (error) {
      alert("Failed to request delivery.");
    }
    setRequestingId(null);
  };

  const handleFromChange = async (e) => {
    const value = e.target.value;
    setSearch((prev) => ({ ...prev, from: value }));
    if (value.length > 1) {
      const suggestions = await fetchCitySuggestions(value);
      setFromSuggestions(suggestions);
      setShowFromSuggestions(true);
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  };

  const handleToChange = async (e) => {
    const value = e.target.value;
    setSearch((prev) => ({ ...prev, to: value }));
    if (value.length > 1) {
      const suggestions = await fetchCitySuggestions(value);
      setToSuggestions(suggestions);
      setShowToSuggestions(true);
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  };

  const handleFromSuggestionClick = (suggestion) => {
    setSearch((prev) => ({ ...prev, from: suggestion }));
    setFromSuggestions([]);
    setShowFromSuggestions(false);
  };

  const handleToSuggestionClick = (suggestion) => {
    setSearch((prev) => ({ ...prev, to: suggestion }));
    setToSuggestions([]);
    setShowToSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        fromInputRef.current &&
        !fromInputRef.current.contains(event.target)
      ) {
        setShowFromSuggestions(false);
      }
      if (
        toInputRef.current &&
        !toInputRef.current.contains(event.target)
      ) {
        setShowToSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-100 py-12 px-0 sm:px-0 lg:px-0">
      <div className="max-w-7xl mx-auto">
        {/* Sticky Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/95 rounded-2xl p-6 mb-10 border border-blue-100 mx-4 md:mx-0 sticky top-0 z-30 backdrop-blur-md border-b-2 border-blue-100"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative col-span-2" ref={fromInputRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="flex flex-col items-center">
                  <FaMapMarkerAlt className="text-blue-600 mb-1" />
                  <div className="w-0.5 h-4 bg-blue-200"></div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Pickup location..."
                value={search.from}
                onChange={handleFromChange}
                className="pl-10 py-3 w-full rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-300 transition bg-blue-50"
                autoComplete="off"
              />
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <ul className="absolute z-10 left-0 right-0 bg-white border border-blue-200 rounded-xl mt-1 shadow-lg max-h-56 overflow-y-auto">
                  {fromSuggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => handleFromSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative col-span-2" ref={toInputRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-green-600" />
              </div>
              <input
                type="text"
                placeholder="Delivery destination..."
                value={search.to}
                onChange={handleToChange}
                className="pl-10 py-3 w-full rounded-xl border border-green-200 focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition bg-green-50"
                autoComplete="off"
              />
              {showToSuggestions && toSuggestions.length > 0 && (
                <ul className="absolute z-10 left-0 right-0 bg-white border border-green-200 rounded-xl mt-1 shadow-lg max-h-56 overflow-y-auto">
                  {toSuggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-green-50 cursor-pointer"
                      onClick={() => handleToSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-blue-400" />
              </div>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={search.date}
                onChange={e => setSearch({ ...search, date: e.target.value })}
                className="pl-10 py-3 w-full rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-300 transition bg-blue-50"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold rounded-xl py-3 px-6 flex items-center justify-center shadow-md hover:shadow-lg transition-all col-span-5 md:col-span-1"
            >
              <FaSearch className="mr-2" /> Search
            </button>
          </form>
        </motion.div>
        {/* Main Content: Filters (left) + Deliveries (right) in a row */}
        <div className="flex flex-row gap-8 w-full">
          {/* Left Sidebar: Filters (desktop) */}
          <aside className="hidden md:block min-w-[340px] max-w-sm w-full bg-white/90 rounded-2xl p-10 border border-[#e0e7ff] h-fit sticky top-44 self-start mt-6">
            <h3 className="text-lg font-bold mb-4 text-[#1e293b]">Filters</h3>
            {/* Capacity Filter (replace Vehicle Type) */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">Min. Capacity</label>
              <select
                className="w-full rounded-lg border border-[#e0e7ff] px-3 py-2"
                value={filters.capacity}
                onChange={e => setFilters(f => ({ ...f, capacity: e.target.value }))}
              >
                <option value="">Any</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            {/* Price Range Filter */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">Max Price (₹)</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={filters.price}
                onChange={e => setFilters(f => ({ ...f, price: e.target.value }))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-[#64748b] mt-1">
                <span>₹100</span><span>₹{filters.price}</span>
              </div>
            </div>
            {/* Date Filter */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
                className="w-full rounded-lg border border-[#e0e7ff] px-3 py-2"
              />
            </div>
            <button
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg py-2 font-semibold mt-4 hover:from-indigo-700 hover:to-blue-600 transition"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </aside>

          {/* Mobile Filters: horizontal bar below search, above deliveries */}
          <div className="block md:hidden w-full mb-6 mt-6">
            <div className="bg-white/90 rounded-2xl p-6 border border-[#e0e7ff] flex flex-col gap-6">
              <div className="flex flex-wrap gap-4">
                {/* Price Range */}
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Max Price</label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={filters.price}
                    onChange={e => setFilters(f => ({ ...f, price: e.target.value }))}
                    className="w-full accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-[#64748b] mt-0.5">
                    <span>₹100</span><span>₹{filters.price}</span>
                  </div>
                </div>
                {/* Date */}
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
                    className="w-full rounded-lg border border-[#e0e7ff] px-2 py-1 text-sm"
                  />
                </div>
                {/* Remove Vehicle Type from mobile filters, use Capacity instead */}
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Min Capacity</label>
                  <select
                    className="w-full rounded-lg border border-[#e0e7ff] px-2 py-1 text-sm"
                    value={filters.capacity}
                    onChange={e => setFilters(f => ({ ...f, capacity: e.target.value }))}
                  >
                    <option value="">Any</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
              <button
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg py-2 font-semibold hover:from-indigo-700 hover:to-blue-600 transition"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Right Content Area: Deliveries and Results */}
          <div className="flex-1 min-h-[70vh]">
            {/* Results Count & Sorting */}
            {!loading && deliveries.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4"
              >
                <h2 className="text-xl font-semibold text-[#1e293b]">
                  {filteredDeliveries.length} {filteredDeliveries.length === 1 ? 'Delivery' : 'Deliveries'} Available
                </h2>
                <div className="flex items-center text-sm text-[#64748b]">
                  <span className="mr-2">Sort by:</span>
                  <select className="bg-white border border-[#e0e7ff] rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Earliest Departure</option>
                    <option>Price (Low to High)</option>
                    <option>Price (High to Low)</option>
                    <option>Vehicle Capacity</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center h-64"
              >
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
                  <p className="text-[#64748b]">Finding available deliveries...</p>
                </div>
              </motion.div>
            )}

            {/* Delivery List */}
            {!loading && filteredDeliveries.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-6"
              >
                {filteredDeliveries.map((delivery, index) => (
                  <motion.div
                    key={delivery._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-blue-100 transition-all w-full max-w-3xl mx-auto min-h-[180px] p-8 sm:p-10"
                  >
                    {/* Strictly 2-row card layout, matching Rides */}
                    <div className="flex flex-col gap-6">
                      {/* Row 1: User, Route, Price, Request Button */}
                      <div className="flex flex-row items-center justify-between gap-4 py-4">
                        {/* User Details (left) */}
                        <div className="flex items-center gap-3 min-w-[120px]">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <FaUser className="text-indigo-600 text-lg" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-sm truncate max-w-[80px]">{delivery.captain?.name || 'Available Driver'}</span>
                            <div className="flex items-center mt-0.5">
                              {[...Array(5)].map((_, i) =>
                                i < Math.floor(delivery.rating) ? (
                                  <FaStar key={i} className="text-yellow-400 text-xs" />
                                ) : (
                                  <FaRegStar key={i} className="text-yellow-400 text-xs" />
                                )
                              )}
                              <span className="ml-1 text-gray-500 text-xs">{delivery.rating}</span>
                            </div>
                          </div>
                        </div>
                        {/* Source to Destination (center) */}
                        <div className="flex-1 flex flex-col items-center min-w-0">
                          <div className="flex items-center gap-2 text-lg font-bold text-gray-900 truncate">
                            <span className="truncate max-w-[100px]">{delivery.from}</span>
                            <FaArrowRight className="mx-1 text-gray-300 text-xl" />
                            <span className="truncate max-w-[100px]">{delivery.to}</span>
                          </div>
                        </div>
                        {/* Request Delivery Button (rightmost) */}
                        <button
                          onClick={() => handleRequest(delivery._id)}
                          disabled={requestingId === delivery._id}
                          className={`bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap text-base min-w-[100px] ${requestingId === delivery._id ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {requestingId === delivery._id ? 'Sending Request...' : 'Request Delivery'}
                        </button>
                      </div>
                      {/* Row 2: Delivery Details */}
                      <div className="flex flex-row flex-wrap items-center justify-between gap-4 border-t border-blue-50 pt-5 pb-2">
                        {/* Date & Time */}
                        <div className="flex items-center text-gray-500 gap-2 text-base">
                          <FaCalendarAlt className="text-indigo-400 mr-1" />
                          <span>{delivery.date ? delivery.date.split('T')[0] : ''}</span>
                          <span className="mx-2">•</span>
                          
                        </div>
                        {/* Capacity */}
                        <div className="flex items-center text-gray-500 gap-2 text-base">
                          <FaBoxOpen className="text-indigo-400 mr-1" />
                          <span className="bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-base font-semibold">
                            {delivery.availableSpace} capacity
                          </span>
                        </div>
                        {/* Price (bottom, green and bold) */}
                        <span className="text-green-600 font-extrabold text-lg">
                          ₹{delivery.price}
                        </span>
                        {/* Vehicle Type (optional) */}
                        {delivery.vehicleType && (
                          <div className="flex items-center text-gray-500 gap-2 text-base">
                            <FaTruck className="text-indigo-400 mr-1" />
                            <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-base font-semibold">
                              {delivery.vehicleType}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            {/* Empty */}
            {!loading && filteredDeliveries.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-10 text-center max-w-2xl mx-auto"
              >
                <div className="w-40 h-40 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaTruck className="text-indigo-400 text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-[#1e293b] mb-3">No deliveries available</h2>
                <p className="text-[#64748b] mb-6">Try adjusting your filters or check back later</p>
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2 px-6 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoodsDeliveries;
