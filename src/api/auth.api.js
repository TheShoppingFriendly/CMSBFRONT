import api from "./axios";

export const adminLogin = (data) =>
  api.post("/admin/auth/login", data);

export const getAdminProfile = () =>
  api.get("/admin/auth/me");
