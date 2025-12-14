import { axiosInstance } from "../axios";

export const CreateGeneric = async (formData) => {
  const fd = new FormData();

  for (let key in formData) {
    if (formData[key] === undefined || formData[key] === null) continue;

    // FIX ONLY THIS KEY → stringify array
    if (key === "availableBrands") {
      fd.append(key, JSON.stringify(formData[key]));
      continue;
    }

    // images / files
    if (formData[key] instanceof File) {
      fd.append(key, formData[key]);
      continue;
    }

    // normal text fields
    fd.append(key, formData[key]);
  }

  const response = await axiosInstance.post("/generic/create", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const GetGenerics = async () => {
  const response = await axiosInstance.get("/generic/getAll");
  return response.data;
};
export const GetAllopathicGenerics = async () => {
  const response = await axiosInstance.get("/generic/getAllopathicGenerics");
  return response.data;
};
export const GetAllHerbalGenerics = async () => {
  const response = await axiosInstance.get("/generic/getHerbalGenerics");
  return response.data;
};

export const GetGenericById = async (id) => {
  const response = await axiosInstance.get(`/generic/${id}`);
  return response.data;
};

export const UpdateGeneric = async (id, formData) => {
  const fd = new FormData();

  for (let key in formData) {
    if (formData[key] === undefined || formData[key] === null) continue;

    // SAME FIX → stringify brands array
    if (key === "availableBrands") {
      fd.append(key, JSON.stringify(formData[key]));
      continue;
    }

    // images / files
    if (formData[key] instanceof File) {
      fd.append(key, formData[key]);
      continue;
    }

    // normal text fields
    fd.append(key, formData[key]);
  }

  const response = await axiosInstance.put(`/generic/update/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const DeleteGeneric = async (id) => {
  const response = await axiosInstance.delete(`/generic/delete/${id}`);
  return response.data;
};

export const GenericOptions = async () => {
  const response = await axiosInstance.get("/generic/options");
  return response.data;
};
