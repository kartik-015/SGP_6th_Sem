import { API } from "./client.js";

export const login = (payload) => API.post("/user/login", payload).then(r => r.data?.data);
export const register = (payload) => API.post("/user/register", payload).then(r => r.data?.data);
export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};


