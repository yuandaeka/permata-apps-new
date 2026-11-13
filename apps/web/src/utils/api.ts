import axios from "axios";

/**
 * Base URL untuk pemanggilan ke layanan Backend API (@permata/api).
 * Jika NEXT_PUBLIC_API_URL diset di Vercel, request akan mengarah ke URL tersebut
 * atau melalui proxy rewrite `/api/v1` pada Next.js.
 */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(
  /\/+$/,
  "",
);

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("permata_access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

