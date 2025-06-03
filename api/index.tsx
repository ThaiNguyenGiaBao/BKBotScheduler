import axios from "axios";

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYjM2ZmExMi1lMDAyLTQwYmEtYmY3Yy0yMGY5NzliMGQ5NjYiLCJlbWFpbCI6ImJhby50aGFpbmd1eWVua2htdEBoY211dC5lZHUudm4iLCJpYXQiOjE3NDg5NjIwOTQsImV4cCI6MTc0ODk2NTY5NH0.ZbYjU38PRCmweOlysqfkLTPXI4yHYNAHUAXQnT0ITWI'


const api = axios.create({
  baseURL: "http://103.82.133.50:5000/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Set token before every request
api.interceptors.request.use(
  async (config) => {
    const token = TOKEN;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Handle 401 to refresh token automatically
// api.interceptors.response.use(...)

export default api;
