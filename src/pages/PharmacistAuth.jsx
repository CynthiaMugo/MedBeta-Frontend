import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const countryCodes = [
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+254", country: "Kenya" },
  { code: "+91", country: "India" },
];

function PatientAuthForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+254",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Build a user object compatible with PrivateRoute
      const user = {
        name: form.name,
        email: form.email,
        phone: form.countryCode + form.phone,
        role: "patient", // must match PrivateRoute role
        isVerified: true, // to bypass verification checks
      };

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(user));

      //  Redirect to dashboard
      setTimeout(() => {
        navigate("/patient-dashboard");
      }, 500);
    } catch (err) {
      console.error("Auth error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Patient Registration
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jane Doe"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="jane@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={form.countryCode}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.country} ({c.code})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="flex-1 p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="712345678"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a secure password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold transition-all ${
              loading
                ? "bg-blue-300 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            }`}
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-sm text-gray-600 mt-6 text-center">
          Already registered?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer font-medium"
            onClick={() => navigate("/auth")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default PatientAuthForm;