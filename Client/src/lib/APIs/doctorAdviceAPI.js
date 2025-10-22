 import { axiosInstance } from "../axios";

// CREATE Doctor Advice
export const CreateDoctorAdvice = async (formData) => {
  const fd = new FormData();

  for (let key in formData) {
    if (formData[key] !== undefined && formData[key] !== null) {
      fd.append(key, formData[key]);
    }
  }

  const response = await axiosInstance.post("/doctorAdvice/create", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// GET ALL Doctor Advices
export const GetAllDoctorAdvices = async () => {
  const response = await axiosInstance.get("/doctorAdvice/getAll");
  return response.data;
};

// GET Doctor Advice by ID
export const GetDoctorAdviceById = async (id) => {
  const response = await axiosInstance.get(`/doctorAdvice/${id}`);
  return response.data;
};

// UPDATE Doctor Advice
export const UpdateDoctorAdvice = async (id, formData) => {
  const fd = new FormData();

  for (let key in formData) {
    if (formData[key] !== undefined && formData[key] !== null) {
      fd.append(key, formData[key]);
    }
  }

  const response = await axiosInstance.put(`/doctorAdvice/update/${id}`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// DELETE Doctor Advice
export const DeleteDoctorAdvice = async (id) => {
  const response = await axiosInstance.delete(`/doctorAdvice/delete/${id}`);
  return response.data;
};
