import api from "@/api/client";

export const getProducts = (params) =>
  api.get("/products", { params }).then((res) => res.data);