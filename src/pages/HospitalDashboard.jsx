import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FileUp, PlusCircle, FileText, X } from "lucide-react";
import { API_URL } from "../config";

// === UI Components ===
const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded transition font-medium ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none ${className}`}
  />
);

const Table = ({ children }) => (
  <table className="min-w-full text-left border border-gray-200 rounded-lg">
    {children}
  </table>
);

const TableHeader = ({ children }) => (
  <thead className="bg-gray-100 text-gray-700 font-semibold">{children}</thead>
);

const TableBody = ({ children }) => <tbody>{children}</tbody>;
const TableRow = ({ children }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">{children}</tr>
);
const TableHead = ({ children }) => (
  <th className="py-2 px-4 text-sm">{children}</th>
);
const TableCell = ({ children }) => (
  <td className="py-2 px-4 text-sm">{children}</td>
);

const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
};

// === Hospital Dashboard ===
export default function HospitalDashboard() {
  const [staff, setStaff] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", role: "" });
  const [file, setFile] = useState(null);
  const [agreementSigned, setAgreementSigned] = useState(false);
  const [hospitalId, setHospitalId] = useState(null);

  // Fetch staff on load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.hospital_id) {
      setHospitalId(user.hospital_id);
      fetchStaff(user.hospital_id);
    }
  }, []);

  // === Fetch hospital staff ===
  const fetchStaff = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/hospitals/${id}/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data);
    } catch (err) {
      console.error("Fetch staff error:", err);
      toast.error("Failed to load staff");
    }
  };

  // === Add single staff (via /invite-staff) ===
  const handleAddStaff = async () => {
    if (!newStaff.name || !newStaff.email || !newStaff.role) {
      toast.error("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: newStaff.name.trim(),
        email: newStaff.email.trim(),
        role: newStaff.role.trim(),
      };

      const res = await axios.post(`${API_URL}/hospitals/invite-staff`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(res.data.message || "Invite sent successfully");
      setModalOpen(false);
      setNewStaff({ name: "", email: "", role: "" });
      fetchStaff(hospitalId);
    } catch (error) {
      console.error("Error inviting staff:", error);
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to invite staff";
      toast.error(errMsg);
    }
  };

  // === Upload CSV (optional, same route until bulk invite is ready) ===
  const handleFileUpload = async () => {
    if (!file) return toast.error("Select a file first");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${API_URL}/hospitals/${hospitalId}/upload-staff`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message || "File uploaded successfully");
      setFile(null);
      fetchStaff(hospitalId);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload staff file");
    }
  };

  // === Sign Data-Sharing Agreement ===
  const handleAgreement = async () => {
    if (!hospitalId) return toast.error("Hospital ID not found");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/hospitals/${hospitalId}/agreement`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAgreementSigned(true);
      toast.success("Data-Sharing Agreement signed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign Data-Sharing Agreement");
    }
  };

  // === Render ===
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800">
        Hospital Dashboard
      </h1>

      {/* Staff Management */}
      <Card className="shadow-md">
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Staff Management</h2>
            <div className="flex gap-2">
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  setNewStaff({ ...newStaff, role: "doctor" });
                  setModalOpen(true);
                }}
              >
                <PlusCircle className="mr-2 w-4 h-4 inline" /> Add Doctor
              </Button>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  setNewStaff({ ...newStaff, role: "labtech" });
                  setModalOpen(true);
                }}
              >
                <PlusCircle className="mr-2 w-4 h-4 inline" /> Add Lab Tech
              </Button>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  setNewStaff({ ...newStaff, role: "pharmacist" });
                  setModalOpen(true);
                }}
              >
                <PlusCircle className="mr-2 w-4 h-4 inline" /> Add Pharmacist
              </Button>
            </div>
          </div>

          {/* Staff Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((person, idx) => (
                <TableRow key={idx}>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.email}</TableCell>
                  <TableCell className="capitalize">{person.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* CSV Upload */}
          <div className="mt-6 flex items-center gap-3">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              onClick={handleFileUpload}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <FileUp className="mr-2 w-4 h-4 inline" /> Upload CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agreement Section */}
      <Card className="shadow-md border border-gray-200">
        <CardContent>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Data-Sharing Agreement
          </h2>
          <p className="text-gray-600 mb-4">
            Hospitals must agree to securely share patient data only for
            treatment, diagnosis, and authorized research purposes.
          </p>
          {agreementSigned ? (
            <p className="text-green-600 font-semibold">
              ✅ Agreement Signed
            </p>
          ) : (
            <Button
              onClick={handleAgreement}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign Agreement
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Add Staff Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-lg font-semibold mb-4">
          Invite{" "}
          {newStaff.role
            ? newStaff.role.charAt(0).toUpperCase() + newStaff.role.slice(1)
            : "Staff"}
        </h3>
        <div className="space-y-3">
          <Input
            placeholder="Full Name"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email Address"
            value={newStaff.email}
            onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
          />
          <Button
            onClick={handleAddStaff}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Send Invite Email
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
