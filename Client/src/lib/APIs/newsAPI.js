import { axiosInstance } from "../axios";

export const CreateNews = async (formData) => {
  const fd = new FormData();
  // loop through sab values
  for (let key in formData) {
    if (formData[key] !== undefined && formData[key] !== null) {
      fd.append(key, formData[key]);
    }
  }

  const response = await axiosInstance.post("/news/create", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const GetAllNews = async () => {
  const response = await axiosInstance.get("/news/getAll");
  return response.data;
};

export const GetNewsById = async (id) => { 
  const response = await axiosInstance.get(`/news/${id}`);
  return response.data;
};

export const UpdateNews = async (id, formData) => {
  const fd = new FormData();
  // loop through sab values
  for (let key in formData) {
    if (formData[key] !== undefined && formData[key] !== null) {
      fd.append(key, formData[key]);
    }
  }

  const response = await axiosInstance.put(`/news/update/${id}`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const DeleteNews = async (id) => {
  const response = await axiosInstance.delete(`/news/delete/${id}`);
  return response.data;
};
