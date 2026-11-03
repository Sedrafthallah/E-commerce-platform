import api from "@/api/client";

export const login = (credentials) =>
  api.post("/auth/login", credentials).then((res) => res.data);

export const logout = () => api.post("/auth/logout").then((res) => res.data);
