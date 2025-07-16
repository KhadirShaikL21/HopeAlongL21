import React, { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../config/api.js";
import { authFetch } from "../utils/auth.js";

const GEO_API_KEY = "df8a98a451mshcf053dbb1d0a300p1316b6jsnc5fc3d394c49";
const GEO_API_HOST = "wft-geo-db.p.rapidapi.com";

const fetchCitySuggestions = async (query) => {
  if (!query) return [];
  try {
    const res = await fetch(
      `https://${GEO_API_HOST}/v1/geo/cities?namePrefix=${encodeURIComponent(
        query
      )}&limit=5&types=CITY`,
      {
        headers: {
          "X-RapidAPI-Key": GEO_API_KEY,
          "X-RapidAPI-Host": GEO_API_HOST,
        },
      }
    );
    const data = await res.json();
    return data.data.map((city) => city.city); // Only city name
  } catch (error) {
    console.error("GeoDB error:", error.message);
    return [];
  }
};

const CreateRide = () => {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seatsAvailable: 1,
    costPerSeat: "",
    vehicleType: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const fromInputRef = useRef();
  const toInputRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await authFetch(`${API_BASE_URL}/api/rides`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Ride created successfully!");
        setForm({
          from: "",
          to: "",
          date: "",
          time: "",
          seatsAvailable: 1,
          costPerSeat: "",
          vehicleType: "",
          notes: "",
        });
      } else {
        setMsg(data.message || "Failed to create ride");
      }
    } catch (err) {
      setMsg("Server error");
    }
    setLoading(false);
  };

  const handleFromChange = async (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, from: value }));
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
    setForm((prev) => ({ ...prev, to: value }));
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
    setForm((prev) => ({ ...prev, from: suggestion }));
    setFromSuggestions([]);
    setShowFromSuggestions(false);
  };

  const handleToSuggestionClick = (suggestion) => {
    setForm((prev) => ({ ...prev, to: suggestion }));
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 rounded-3xl shadow-xl p-10 w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
          Create a Ride
        </h2>
        <div className="flex gap-4">
          <div className="relative w-1/2" ref={fromInputRef}>
            <input
              type="text"
              name="from"
              placeholder="From"
              value={form.from}
              onChange={handleFromChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
              autoComplete="off"
            />
            {showFromSuggestions && fromSuggestions.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-56 overflow-y-auto">
                {fromSuggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                    onClick={() => handleFromSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative w-1/2" ref={toInputRef}>
            <input
              type="text"
              name="to"
              placeholder="To"
              value={form.to}
              onChange={handleToChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
              autoComplete="off"
            />
            {showToSuggestions && toSuggestions.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-56 overflow-y-auto">
                {toSuggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                    onClick={() => handleToSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-1/3 px-4 py-2 border rounded-xl"
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-1/3 px-4 py-2 border rounded-xl"
          />
        </div>
        <div className="flex gap-4">
          <input
            type="number"
            name="seatsAvailable"
            min={1}
            placeholder="Seats"
            value={form.seatsAvailable}
            onChange={handleChange}
            required
            className="w-1/2 px-4 py-2 border rounded-xl"
          />
          <input
            type="number"
            name="costPerSeat"
            min={0}
            placeholder="Price per seat"
            value={form.costPerSeat}
            onChange={handleChange}
            required
            className="w-1/2 px-4 py-2 border rounded-xl"
          />
        </div>
        <input
          type="text"
          name="vehicleType"
          placeholder="Vehicle Type"
          value={form.vehicleType}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
        />
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transition"
        >
          {loading ? "Creating..." : "Create Ride"}
        </button>
        {msg && (
          <div className="text-center mt-2 text-indigo-700 font-medium">{msg}</div>
        )}
      </form>
    </div>
  );
};

export default CreateRide;