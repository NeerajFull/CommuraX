import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});

const ANOTHER_BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://commurax.onrender.com/";
export const anotherAxiosInstance = axios.create({
  baseURL: ANOTHER_BASE_URL,
  withCredentials: true, // send cookies with the request
});
