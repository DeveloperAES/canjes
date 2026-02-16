import axios from "axios";

const axiosAdminClient = axios.create({
  // baseURL: import.meta.env.VITE_API_ADMIN_URL || "https://localhost:7128/api",
  baseURL: import.meta.env.VITE_API_ADMIN_URL || "https://localhost:7128/api",

  headers: {
    "Content-Type": "application/json",
  },
});

axiosAdminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAdminClient;
