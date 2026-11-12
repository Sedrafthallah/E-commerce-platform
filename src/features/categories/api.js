import api from "@/api/client";
import { getWithETag } from "@/api/etagCache";

export const getCategories = (params) =>
  getWithETag(api, "/categories", { params }).then((res) => res.data);
