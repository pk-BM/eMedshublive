import { axiosInstance } from "../axios";

export const CreateBrand = async (formData) => {
  const fd = new FormData();
  for (let key in formData) {
    if (formData[key] !== undefined && formData[key] !== null) {
      fd.append(key, formData[key]);
    }
  }

  const response = await axiosInstance.post("/brand/create", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const UpdateBrand = async (id, formData) => {
  const fd = new FormData();
  for (let key in formData) {
    if (formData[key] !== undefined && formData[key] !== null) {
      fd.append(key, formData[key]);
    }
  }

  const response = await axiosInstance.put(`/brand/update/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const DeleteBrand = async (id) => {
  const response = await axiosInstance.delete(`/brand/delete/${id}`);
  return response.data;
};

export const getBrandById = async (id) => {
  const response = await axiosInstance.get(`/brand/${id}`);
  return response.data;
};

export const GetAllBrands = async () => {
  const response = await axiosInstance.get("/brand/getAll");
  return response.data;
};
