import { axiosInstance } from "../axios";

export const CreateBanner = async (fd) => {
    const response = await axiosInstance.post("/banner/create", fd);
    return response.data;
};

export const GetAllBanners = async () => {
    const response = await axiosInstance.get("/banner/getAll");
    return response.data;
};

export const LimitedBanners = async () => {
    const response = await axiosInstance.get("/banner/getLimitedBanners");
    return response.data
}

export const GetBannerById = async (id) => {
    const response = await axiosInstance.get(`/banner/${id}`);
    return response.data;
};


export const UpdateBanner = async (id, fd) => {
    const response = await axiosInstance.put(`/banner/update/${id}`, fd);
    return response.data;
};

export const DeleteBanner = async (id) => {
    const response = await axiosInstance.delete(`/banner/delete/${id}`);
    return response.data;
};
