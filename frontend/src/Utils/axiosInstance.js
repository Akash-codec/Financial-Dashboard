import axios from "axios";
import { BASE_URL } from "./apiPaths";
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        let accessToken = localStorage.getItem("token");
        
        // gracefully fallback to Redux's user localized object 
        if (!accessToken) {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    accessToken = user.token;
                } catch (e) {}
            }
        }

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors globally
        if (error.response) {
            if (error.response.status === 401) {
               // Redirect to login page
               localStorage.removeItem('user');
               localStorage.removeItem('token');
               if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                    window.location.href = "/login";
               } 
            } else if (error.response.status === 500) {
                toast.error("Server error. Please try again later.", { id: 'serverError' });
                console.error("Server error. Please try again later.");
            } else if (error.code === "ECONNABORTED") {
                toast.error("Request timeout. Please try again.", { id: 'timeout' });
                console.error("Request timeout. Please try again.");
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
