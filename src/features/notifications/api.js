import api from "@/api/client";

export const getNotifications = (params) =>
  api.get("/notifications", { params }).then((res) => res.data);
