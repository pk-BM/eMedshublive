import { axiosInstance } from "../axios";

export const Create = async (about) => {
  const respose = await axiosInstance.post("/about/create", { about });
  return respose.data;
};
export const Update = async (about, id) => {
  const respose = await axiosInstance.post(`/about/update/${id}`, { about });
  return respose.data;
};

export const GetAbout = async () => {
  const respose = await axiosInstance.get("/about");
  return respose.data;
};
