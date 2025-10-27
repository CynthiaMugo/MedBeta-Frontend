import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically for every authenticated request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration or unauthorized access globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // JWT expired or invalid
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // Force re-login
    }
    return Promise.reject(error);
  }
);

export default api;
