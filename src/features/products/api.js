import api from "@/api/client";
import { getWithETag } from "@/api/etagCache";

export const getProducts = (params) =>
  getWithETag(api, "/products", { params }).then((res) => res.data);

export const getProductById = (id) =>
  getWithETag(api, `/products/${id}`).then((res) => res.data);

export const createProduct = (formData) =>
  api.post("/products", formData).then((res) => res.data);
