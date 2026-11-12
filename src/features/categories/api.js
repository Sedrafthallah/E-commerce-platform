// import api from "@/api/client";

// export const getCategories = (params) =>
//   api.get("/categories", { params }).then((res) => res.data);

// import api from "@/api/client";
// import { getWithETag } from "@/api/etagCache";

// export const getCategories = (params) =>
//   getWithETag(api, "/categories", { params }).then((res) => res.data);

import api from "@/api/client";

export const getCategories = async (params) => {
  console.log("1. getCategories function called");

  const response = await api.get("/categories", { params });

  console.log("2. Response received:", response.status);
  console.log("3. Response headers:", response.headers);
  console.log("4. ETag:", response.headers.etag);

  return response.data;
};
