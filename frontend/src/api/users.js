import { API } from "./client.js";

export const getUsers = (params) => API.get("/user", { params }).then(r => r.data);
export const getUserByBarcode = (barcode) => API.get(`/user/scan/${barcode}`).then(r => r.data);
export const createUser = (data) => API.post("/user", data).then(r => r.data);
export const deleteUser = (id) => API.delete(`/user/${id}`).then(r => r.data);


