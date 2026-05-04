import axios from "axios";

/**
 * In development, always use same-origin `/api` so Vite proxies to Express and
 * httpOnly auth cookies are set for `localhost:5173`. Pointing Axios at
 * `:5000` directly breaks sessions because the cookie is scoped to another origin.
 */
const baseURL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export function getApiOrigin() {
  return baseURL || "";
}
