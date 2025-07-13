import React, { useEffect, useState } from "react";

const Profile = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true); // Start as loading
  const [error, setError] = useState("");

useEffect(() => {
  setLoading(true);
  fetch("http://localhost:5000/api/auth/me", { credentials: "include" })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    })
    .then(data => {
      setForm({
        name: data.user.name || "",
        email: data.user.email || "",
        password: ""
      });
    })
    .catch(() => setError("Failed to load profile"))
    .finally(() => setLoading(false));
}, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      alert("Profile updated!");
    } else {
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-100 py-12 px-0 sm:px-0 lg:px-0">
      <div className="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">My Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Name"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password (leave blank to keep current)"
            type="password"
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;