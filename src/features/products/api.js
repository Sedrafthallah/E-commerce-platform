import api from "@/api/client";

export const getProducts = (params) =>
  api.get("/products", { params }).then((res) => res.data);

export const getProductById = (id) =>
  api.get(`/products/${id}`).then((res) => res.data);

export const createProduct = (formData) =>
  api.post("/products", formData).then((res) => res.data);
