import api from "@/api/client";

export const getCategories = (params) =>
  api.get("/categories", { params }).then((res) => res.data);