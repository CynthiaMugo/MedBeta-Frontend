import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, RefreshCw } from "lucide-react";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.redirectPath || "/doctor-dashboard";

  // Countdown timer for resend button
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerify = (e) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      if (otp === "1234") {
        // ✅ Show cinematic success animation
        setIsSuccess(true);
        setTimeout(() => {
          navigate(redirectPath);
        }, 2500);
      } else {
        alert("❌ Invalid OTP. Try again.");
        setIsVerifying(false);
      }
    }, 1200);
  };

  const handleResend = () => {
    setCanResend(false);
    setTimer(30);
    alert("✅ New OTP sent to your email!");
  };

  // ✨ Success Animation Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 8 }}
          className="flex flex-col items-center text-center"
        >
          <CheckCircle className="text-green-500 w-24 h-24 mb-6 drop-shadow-lg" />
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-blue-700"
          >
            Verification Successful!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-gray-500 mt-2"
          >
            Redirecting to your dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Doctor OTP Verification
        </h1>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Enter the OTP sent to your email
            </label>
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
              maxLength={4}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isVerifying}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </motion.button>
        </form>

        {/* Resend Section */}
        <div className="mt-6 text-center">
          {!canResend ? (
            <p className="text-gray-500 text-sm">
              Resend available in <span className="font-semibold">{timer}s</span>
            </p>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleResend}
              className="flex items-center justify-center gap-2 mx-auto text-blue-600 font-semibold text-sm mt-2 hover:text-blue-800 transition"
            >
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <RefreshCw size={16} />
              </motion.span>
              Resend OTP
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
