import { axiosInstance } from "../axios";

export const Signup = async (formData) => {
  const response = await axiosInstance.post("/auth/signup", formData);
  return response.data;
};

export const Login = async (formData) => {
  const response = await axiosInstance.post("/auth/login", formData);
  return response.data;
};
export const Logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
export const GetMe = async () => {
  const response = await axiosInstance.get("/auth/getMe");
  return response.data;
};
