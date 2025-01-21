import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const axiosSecure = axios.create({
    baseURL: `${baseUrl}`,
    withCredentials: true,
})

const useAxiosSecure = () => {
    return axiosSecure; 
};

export default useAxiosSecure;