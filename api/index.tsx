import axios, { AxiosInstance } from "axios";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYjM2ZmExMi1lMDAyLTQwYmEtYmY3Yy0yMGY5NzliMGQ5NjYiLCJlbWFpbCI6ImJhby50aGFpbmd1eWVua2htdEBoY211dC5lZHUudm4iLCJpYXQiOjE3NDg3NjUyNjksImV4cCI6MTc0ODc2NjE2OX0.PtFMP21DEUymXbrFx8bPhcS2Appf1aEXZlqM7hAm3GY";

const api: AxiosInstance = axios.create({
  baseURL: "http://103.82.133.50:5000/api/v1/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

export default api;