import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditRide = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Fetch ride details to pre-fill the form
    const fetchRide = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/rides`);
      const rides = await res.json();
      const ride = rides.find((r) => r._id === id);
      if (ride) {
        setForm({
          from: ride.from,
          to: ride.to,
          date: ride.date,
          time: ride.time,
          seatsAvailable: ride.seatsAvailable,
          costPerSeat: ride.costPerSeat,
          vehicleType: ride.vehicleType || "",
          notes: ride.notes || "",
        });
      }
      setLoading(false);
    };
    fetchRide();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`http://localhost:5000/api/rides/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Ride updated successfully!");
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        setMsg(data.message || "Failed to update ride");
      }
    } catch (err) {
      setMsg("Server error");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
        <div className="text-xl text-indigo-600 font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 rounded-3xl shadow-xl p-10 w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
          Edit Ride
        </h2>
        <div className="flex gap-4">
          <input
            type="text"
            name="from"
            placeholder="From"
            value={form.from}
            onChange={handleChange}
            required
            className="w-1/2 px-4 py-2 border rounded-xl"
          />
          <input
            type="text"
            name="to"
            placeholder="To"
            value={form.to}
            onChange={handleChange}
            required
            className="w-1/2 px-4 py-2 border rounded-xl"
          />
        </div>
        <div className="flex gap-4">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-1/2 px-4 py-2 border rounded-xl"
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-1/2 px-4 py-2 border rounded-xl"
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
          {loading ? "Updating..." : "Update Ride"}
        </button>
        {msg && (
          <div className="text-center mt-2 text-indigo-700 font-medium">{msg}</div>
        )}
      </form>
    </div>
  );
};

export default EditRide;