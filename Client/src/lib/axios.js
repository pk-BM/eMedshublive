import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  // baseURL: "https://emedshub-server.vercel.app/api",
  // baseURL: "http://localhost:3000/api",
  withCredentials: true,
});
