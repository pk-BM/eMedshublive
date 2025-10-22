import { axiosInstance } from "../axios";
 
export const  TrustedCenterOptions = async () => {
  const response = await axiosInstance.get("/trustedCenter/options");
  return response.data;
};

export const CreateTrustedCenter = async (formData) => {
  const fd = new FormData();
  for (let key in formData) {
    if (formData[key] !== undefined && formData[key] !== null) {
      fd.append(key, formData[key]);
    }
  }

  const response = await axiosInstance.post("/trustedCenter/create", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const UpdateCenter = async (id, formData) => {
  const fd = new FormData();
  for (let key in formData) {
    if (formData[key] !== undefined && formData[key] !== null) {
      fd.append(key, formData[key]);
    }
  }

  const response = await axiosInstance.put(`/trustedCenter/update/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const DeleteTrustedCenter = async (id) => {
  const response = await axiosInstance.delete(`/trustedCenter/delete/${id}`);
  return response.data;
};

export const getCenterById = async (id) => {
  const response = await axiosInstance.get(`/trustedCenter/getById/${id}`);
  return response.data;
};

export const GetAllTrustedCenters = async () => {
  const response = await axiosInstance.get("/trustedCenter/getAll");
  return response.data;
};
