import { axiosInstance } from "../axios";

export const CreateLeader = async (formData) => {
  const fd = new FormData();
  // loop through sab values
  for (let key in formData) {
    if (formData[key] !== undefined && formData[key] !== null) {
      fd.append(key, formData[key]);
    }
  }
  const response = await axiosInstance.post("/leader/create", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const GetLeaders = async () => {
  const response = await axiosInstance.get("/leader/getAll");
  return response.data;
};

export const GetLeaderById = async (id) => {
  const response = await axiosInstance.get(`/leader/${id}`);
  return response.data;
};

export const UpdateLeader = async (id, formData) => {
  const fd = new FormData();
  // loop through sab values
  for (let key in formData) {
    if (formData[key] !== undefined && formData[key] !== null) {
      fd.append(key, formData[key]);
    }
  }
  const response = await axiosInstance.put(`/leader/update/${id}`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const DeleteLeader = async (id) => {
  const response = await axiosInstance.delete(`/leader/delete/${id}`);
  return response.data;
};