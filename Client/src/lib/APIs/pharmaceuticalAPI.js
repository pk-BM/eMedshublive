import { axiosInstance } from "../axios";

export const createPharmaceutical = async (formData) => {
  const fd = new FormData();
  // loop through sab values
  for (let key in formData) {
    if (formData[key] !== undefined && formData[key] !== null) {
      fd.append(key, formData[key]);
    }
  }

  const response = await axiosInstance.post("/pharma/create", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// FOR BRAND CREATION
export const PharmaceuticalOptions = async () => {
  const response = await axiosInstance.get("/pharma/options");
  return response.data;
};

export const GetAllPharmaceutical = async () => {
  const response = await axiosInstance.get("/pharma/getAll");
  return response.data;
};

export const GetPharmaceuticalById = async (id) => { 
  const response = await axiosInstance.get(`/pharma/${id}`);
  return response.data;
};

export const updatePharmaceutical = async (id, formData) => {
  const fd = new FormData();
  // loop through sab values
  for (let key in formData) {
    if (formData[key] !== undefined && formData[key] !== null) {
      fd.append(key, formData[key]);
    }
  }

  const response = await axiosInstance.put(`/pharma/update/${id}`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deletePharmaceutical = async (id) => {
  const response = await axiosInstance.delete(`/pharma/delete/${id}`);
  return response.data;
};