import React, { useEffect, useState } from "react";
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
  FaBell
} from "react-icons/fa";
import { motion } from "framer-motion";
import { IoMdArrowRoundForward } from "react-icons/io";

const GoodsDeliveries = () => {
  const [allDeliveries, setAllDeliveries] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [search, setSearch] = useState({
    from: "",
    to: "",
    date: ""
  });

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/goods");
        const data = await res.json();
        const withRatings = (data.deliveries || []).map((d) => ({
          ...d,
          rating: +(Math.random() * 2 + 3).toFixed(1)
        }));
        setAllDeliveries(withRatings);
        setDeliveries(withRatings);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch deliveries:", error);
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  const handleRequest = async (deliveryId) => {
    setRequestingId(deliveryId);
    const itemDetails = window.prompt("Enter item details for delivery:");
    if (!itemDetails) {
      setRequestingId(null);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/goods-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ deliveryId, itemDetails }),
      });
      const data = await res.json();
      alert(data.msg);
    } catch (error) {
      alert("Failed to request delivery.");
      console.error(error);
    }
    setRequestingId(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = allDeliveries.filter((d) => {
      const fromMatch = d.from.toLowerCase().includes(search.from.toLowerCase());
      const toMatch = d.to.toLowerCase().includes(search.to.toLowerCase());
      const dateMatch = search.date ? d.date === search.date : true;
      return fromMatch && toMatch && dateMatch;
    });
    setDeliveries(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Goods Delivery Network
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with trusted transporters for your package deliveries
          </p>
        </motion.div>

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
                placeholder="Pickup location..."
                value={search.from}
                onChange={e => setSearch({ ...search, from: e.target.value })}
                className="pl-10 py-3 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-300 transition"
              />
            </div>
            <div className="relative col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-red-500" />
              </div>
              <input
                type="text"
                placeholder="Delivery destination..."
                value={search.to}
                onChange={e => setSearch({ ...search, to: e.target.value })}
                className="pl-10 py-3 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-300 transition"
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
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold rounded-xl py-3 px-6 flex items-center justify-center shadow-md hover:shadow-lg transition-all col-span-5 md:col-span-1"
            >
              <FaSearch className="mr-2" /> Search
            </button>
          </form>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-64"
          >
            <div className="flex flex-col items-center">
              <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Finding available deliveries...</p>
            </div>
          </motion.div>
        ) : deliveries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-2xl mx-auto"
          >
            <div className="w-40 h-40 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTruck className="text-indigo-400 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No deliveries available</h2>
            <p className="text-gray-500 mb-6">Try adjusting your search filters or check back later</p>
            <button
              onClick={() => {
                setSearch({ from: "", to: "", date: "" });
                setDeliveries(allDeliveries);
              }}
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {deliveries.length} {deliveries.length === 1 ? 'Delivery' : 'Deliveries'} Available
              </h2>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">Sort by:</span>
                <select className="bg-white border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Earliest Departure</option>
                  <option>Price (Low to High)</option>
                  <option>Price (High to Low)</option>
                  <option>Vehicle Capacity</option>
                </select>
              </div>
            </div>

            {deliveries.map((delivery, index) => (
              <motion.div
                key={delivery._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                          <FaTruck className="text-indigo-600 text-xl" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-gray-800 flex items-center">
                            <span>{delivery.from}</span>
                            <IoMdArrowRoundForward className="mx-2 text-gray-400" />
                            <span>{delivery.to}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                            <div className="flex items-center text-gray-600">
                              <FaCalendarAlt className="mr-2 text-indigo-400" />
                              <span>{delivery.date}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FaClock className="mr-2 text-indigo-400" />
                              <span>{delivery.time}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FaBoxOpen className="mr-2 text-indigo-400" />
                              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                {delivery.vehicleType}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6 md:text-right">
                      <div className="flex md:flex-col items-center md:items-end mb-3">
                        <div className="flex items-center mr-3 md:mr-0 md:mb-2">
                          <button
                            onClick={() => alert("Notification clicked for " + delivery.from + " to " + delivery.to)}
                            className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-2 text-yellow-600 hover:bg-yellow-200 transition"
                          >
                            <FaBell />
                          </button>
                          <div className="text-sm">
                            <div className="font-medium">{delivery.captain?.name || "Available Driver"}</div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                i < Math.floor(delivery.rating) ? 
                                  <FaStar key={i} className="text-yellow-400 text-xs" /> : 
                                  <FaRegStar key={i} className="text-yellow-400 text-xs" />
                              ))}
                              <span className="ml-1 text-gray-500 text-xs">{delivery.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRequest(delivery._id)}
                        disabled={requestingId === delivery._id}
                        className={`bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium py-2 px-6 rounded-lg transition-all shadow-sm hover:shadow-md ${
                          requestingId === delivery._id ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-blue-600'
                        }`}
                      >
                        {requestingId === delivery._id ? 'Sending Request...' : 'Request Delivery'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoodsDeliveries;
