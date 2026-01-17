import api from "./axios";

export const loginAdmin = (data) =>
  api.post("/admin/login", data);
