import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use(
  (config) => {
    
    const publicUrls = [
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/forgot-password"
    ];

    if (publicUrls.some(url => config.url.includes(url))) {
      return config; // 🔥 skip token
    }

    const token = localStorage.getItem("token");

    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
