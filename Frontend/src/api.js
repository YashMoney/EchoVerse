import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Base URL points to Django backend (uses /api/ prefix)
export const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ Automatically attach valid JWT tokens to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expiry_date = decoded.exp;
        const current_time = Date.now() / 1000;

        if (expiry_date > current_time) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Invalid JWT:", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
