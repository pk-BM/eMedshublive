import { axiosInstance } from "../axios"

export const GetSearchResults = async (query) => {
    const response = await axiosInstance.get(`/search?query=${query}`)
    return response.data
}