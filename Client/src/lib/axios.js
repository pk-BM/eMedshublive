import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://emedshub-server.vercel.app/api",
  // baseURL: "http://localhost:3000/api",
  withCredentials: true,
});
