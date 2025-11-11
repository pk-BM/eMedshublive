import { axiosInstance } from "../axios";
import { toast } from "react-toastify";

export const CreateAdvertisement = async (formData) => {
  try {
    const fd = new FormData();
    for (let key in formData) {
      if (formData[key] !== undefined && formData[key] !== null) {
        fd.append(key, formData[key]);
      }
    }
 
    const response = await axiosInstance.post("/advertisement/create", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Advertisement created successfully!");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create advertisement");
    throw error;
  }
};

export const GetAllAdvertisements = async () => {
  try {
    const response = await axiosInstance.get("/advertisement/getAll");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch advertisements");
    throw error;
  }
};


export const GetAdvertisementById = async (id) => {
  try {
    const response = await axiosInstance.get(`/advertisement/${id}`);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch advertisement");
    throw error;
  }
};


export const UpdateAdvertisement = async (id, formData) => {
  try {
    const fd = new FormData();
    for (let key in formData) {
      if (formData[key] !== undefined && formData[key] !== null) {
        fd.append(key, formData[key]);
      }
    }

    const response = await axiosInstance.put(`/advertisement/update/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Advertisement updated successfully!");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update advertisement");
    throw error;
  }
};


export const DeleteAdvertisement = async (id) => {
  try {
    const response = await axiosInstance.delete(`/advertisement/delete/${id}`);
    toast.success("Advertisement deleted successfully!");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete advertisement");
    throw error;
  }
};
