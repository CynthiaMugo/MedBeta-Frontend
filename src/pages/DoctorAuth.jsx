// src/pages/DoctorAuth.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DoctorAuth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  const requestToken = () => {
    if (!name || !email) {
      alert("Please enter your name and email first.");
      return;
    }
    alert(`Verification token sent to ${email}!`);
  };

  const verifyToken = () => {
    if (token === "1234") {
      setIsVerified(true);
      localStorage.setItem(
        "user",
        JSON.stringify({ role: "doctor", name, email, isVerified: true })
      );
      alert("Verification successful!");
    } else {
      alert("Invalid token. Try again.");
    }
  };

  const accessDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.isVerified) {
      navigate("/doctor-dashboard");
    } else {
      alert("You need to verify your token first!");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #a0ff9f, #32cd32, #7fff00)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        width: "400px",
        padding: "40px",
        borderRadius: "16px",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.3)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#004d00", textShadow: "0 0 5px #00ff00" }}>Doctor Login</h2>

        {/* Name Input */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#004d00" }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "2px solid #00ff00",
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "#004d00",
              fontSize: "16px",
              outline: "none",
              transition: "0.3s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#32cd32"}
            onBlur={(e) => e.target.style.borderColor = "#00ff00"}
          />
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#004d00" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "2px solid #00ff00",
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "#004d00",
              fontSize: "16px",
              outline: "none",
              transition: "0.3s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#32cd32"}
            onBlur={(e) => e.target.style.borderColor = "#00ff00"}
          />
        </div>

        {/* Verification Token Input with Request Button */}
        <div style={{ marginBottom: "25px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#004d00" }}>Verification Token</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter token"
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #00ff00",
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#004d00",
                fontSize: "16px",
                outline: "none",
                transition: "0.3s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#32cd32"}
              onBlur={(e) => e.target.style.borderColor = "#00ff00"}
            />
            <button
              onClick={requestToken}
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "#00ff00",
                color: "#004d00",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 10px #00ff00",
                transition: "0.3s"
              }}
              onMouseEnter={(e) => e.target.style.boxShadow = "0 0 20px #32cd32"}
              onMouseLeave={(e) => e.target.style.boxShadow = "0 0 10px #00ff00"}
            >
              Request Token
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={verifyToken}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#32cd32",
              color: "#fff",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 10px #32cd32",
              transition: "0.3s"
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = "0 0 20px #00ff00"}
            onMouseLeave={(e) => e.target.style.boxShadow = "0 0 10px #32cd32"}
          >
            Verify Token
          </button>

          <button
            onClick={accessDashboard}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#1b5e20",
              color: "#fff",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 10px #00ff00",
              transition: "0.3s"
            }}
            onMouseEnter={(e) => e.target.style.boxShadow = "0 0 20px #00ff00"}
            onMouseLeave={(e) => e.target.style.boxShadow = "0 0 10px #00ff00"}
          >
            Access Dashboard
          </button>
        </div>

        {isVerified && <p style={{ color: "#004d00", marginTop: "20px", textAlign: "center", fontWeight: "600", textShadow: "0 0 3px #00ff00" }}>✅ Verified! You can now access your dashboard.</p>}
      </div>
    </div>
  );
}

export default DoctorAuth;
