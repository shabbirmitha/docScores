// src/services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://docscores-be.onrender.com/api",
  withCredentials: true,
});
