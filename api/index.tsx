import axios, { AxiosInstance } from "axios";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYjM2ZmExMi1lMDAyLTQwYmEtYmY3Yy0yMGY5NzliMGQ5NjYiLCJlbWFpbCI6ImJhby50aGFpbmd1eWVua2htdEBoY211dC5lZHUudm4iLCJpYXQiOjE3NDg4ODEyODIsImV4cCI6MTc0ODg4MjE4Mn0.hPQ2Qo-Kgm-8Av6Bh-n13tu_4Zhy0wV3fpk6NCV5Hu4";

const api: AxiosInstance = axios.create({
  baseURL: "http://103.82.133.50:5000/api/v1/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

export default api;