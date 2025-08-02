// src/services/api.ts
import axios, { type AxiosInstance } from "axios";
import { setEncryptedCookie , getEncryptedCookie} from '../lib/secureCookies';
type Backend = "laravel" | "nest";

export const getApi = (backend: Backend): AxiosInstance => {
  const baseURL =
    backend === "laravel"
      ? import.meta.env.VITE_BACKEND_URL
      : import.meta.env.VITE_NEST_URL;

  const instance = axios.create({
    baseURL,
    headers: {
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const token = getEncryptedCookie("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token in request interceptor:", token);
    }
    return config;
  });

  return instance;
};
