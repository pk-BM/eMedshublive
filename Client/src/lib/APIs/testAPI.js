import { axiosInstance } from "../axios";

// ✅ Create a new medical test
export const CreateTest = async (formData) => {
  const response = await axiosInstance.post("/medicaltest/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ✅ Get all medical tests
export const GetAllTests = async () => {
  const response = await axiosInstance.get("/medicaltest/getAll");
  return response.data;
};

// ✅ Get a medical test by ID
export const GetTestById = async (id) => {
  const response = await axiosInstance.get(`/medicaltest/get/${id}`);
  return response.data;
};

// ✅ Update an existing medical test
export const UpdateTest = async (id, formData) => {
  const response = await axiosInstance.put(`/medicaltest/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ✅ Delete a medical test
export const DeleteTest = async (id) => {
  const response = await axiosInstance.delete(`/medicaltest/delete/${id}`);
  return response.data;
};
