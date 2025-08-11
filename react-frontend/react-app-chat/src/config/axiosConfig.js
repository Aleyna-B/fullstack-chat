import axios from 'axios';

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/chat/v1', //Spring Boot backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials (cookies, authorization headers, etc.) if needed
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.url.includes('/auth/')) {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 errors (unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("jwtToken");
      window.location.href = "/login"; // redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;