import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function SetupPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [inviteInfo, setInviteInfo] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Doctor
  const [licenseNumber, setLicenseNumber] = useState("");
  const [specialization, setSpecialization] = useState("");

  // Pharmacy
  const [pharmacyName, setPharmacyName] = useState("");
  const [location, setLocation] = useState("");

  // Hospital
  const [hospitalName, setHospitalName] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/setup-password/${token}`);
        setInviteInfo(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Invalid or expired setup link.");
      }
    };
    fetchInvite();
  }, [token]);

  const routeByRole = (role) => {
    switch (role?.toLowerCase()) {
      case "doctor":
        return "/doctor/dashboard";
      case "hospital":
      case "hospital_admin":
        return "/hospital/dashboard";
      case "pharmacy":
      case "pharmacist":
        return "/pharmacy/dashboard";
      case "labtech":
      case "technician":
        return "/technician/dashboard";
      default:
        return "/auth";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) return setError("Passwords do not match");
    if (!inviteInfo) return;

    const role = inviteInfo.role.toLowerCase();
    const payload = { password };

    // Role-specific fields
    if (role === "doctor") {
      if (!licenseNumber.trim()) return setError("License number is required");
      payload.license_number = licenseNumber;
      payload.specialization = specialization;
    } else if (role === "pharmacy" || role === "pharmacist") {
      if (!pharmacyName.trim()) return setError("Pharmacy name is required");
      payload.name = pharmacyName;
      payload.location = location;
      payload.license_number = licenseNumber;
    } else if (role === "hospital" || role === "hospital_admin") {
      if (!hospitalName.trim()) return setError("Hospital name is required");
      payload.hospital_name = hospitalName;
      payload.license_number = licenseNumber;
      payload.location = location;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/setup-password/${token}`, payload);
      const { access_token, user } = res.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess(true);
      setTimeout(() => navigate(routeByRole(user.role)), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!inviteInfo && !error) return <p className="text-center mt-4">Loading…</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
          Set Up Your Account
        </h2>

        {inviteInfo && (
          <p className="text-center mb-4 text-gray-700">
            Welcome {inviteInfo.name}! Activate your{" "}
            <strong>{inviteInfo.role}</strong> account.
          </p>
        )}

        {success ? (
          <p className="text-green-600 text-center font-semibold">
            Account activated! Redirecting…
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Doctor Fields */}
            {inviteInfo?.role?.toLowerCase() === "doctor" && (
              <>
                <label className="block font-semibold mb-1">License Number *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded mb-4"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                />

                <label className="block font-semibold mb-1">Specialization</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded mb-4"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </>
            )}

            {/* Pharmacy Fields */}
            {["pharmacy", "pharmacist"].includes(inviteInfo?.role?.toLowerCase()) && (
              <>
                <label className="block font-semibold mb-1">Pharmacy Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded mb-4"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  required
                />

                <label className="block font-semibold mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded mb-4"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />

                <label className="block font-semibold mb-1">License Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded mb-4"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />
              </>
            )}

            {/* Hospital Fields */}
            {["hospital", "hospital_admin"].includes(inviteInfo?.role?.toLowerCase()) && (
              <>
                <label className="block font-semibold mb-1">Hospital Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded mb-4"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  required
                />

                <label className="block font-semibold mb-1">License Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded mb-4"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />

                <label className="block font-semibold mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded mb-4"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </>
            )}

            {/* Password Fields */}
            <label className="block font-semibold mb-1">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label className="block font-semibold mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving…" : "Activate Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
