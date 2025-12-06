import { axiosInstance } from "../axios";

export const uploadHero = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axiosInstance.post("/hero/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const getHero = async () => {
  const res = await axiosInstance.get("/hero/get");
  return res.data;
};
