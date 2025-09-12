import { API } from "./client.js";

export const listRequests = (params) => API.get("/borrow", { params }).then(r => r.data);
export const requestBorrow = (data) => API.post("/borrow", data).then(r => r.data);
export const approveBorrow = (id, data) => API.post(`/borrow/${id}/approve`, data).then(r => r.data);
export const denyBorrow = (id, data) => API.post(`/borrow/${id}/deny`, data).then(r => r.data);
export const returnItem = (id, data) => API.post(`/borrow/${id}/return`, data).then(r => r.data);


