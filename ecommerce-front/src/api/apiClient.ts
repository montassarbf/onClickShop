import axios, { type AxiosInstance } from "axios";

// Base URL is loaded from the .env file (VITE_API_URL).
// This means the same codebase works for both local dev and production
// without changing any code — just change the .env value.
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Automatically attach the auth token to every request if the user is logged in.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
