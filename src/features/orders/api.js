import api from "@/api/client";

export const getOrders = (params) =>
  api.get("/orders", { params }).then((res) => res.data);

export const changeOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status }).then((res) => res.data);