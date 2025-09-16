import { API } from "./client.js";

const unwrap = (r) => r?.data?.data ?? r?.data;

export const listRequests = (params) => API.get("/borrow", { params }).then(unwrap);
export const requestBorrow = (data) => API.post("/borrow", data).then(unwrap);
export const approveBorrow = (id, data) => API.post(`/borrow/${id}/approve`, data).then(unwrap);
export const denyBorrow = (id, data) => API.post(`/borrow/${id}/deny`, data).then(unwrap);
export const returnItem = (id, data) => API.post(`/borrow/${id}/return`, data).then(unwrap);
export const payPenalty = (id) => API.post(`/borrow/${id}/pay-penalty`).then(unwrap);
export const markOverdueItems = () => API.post("/borrow/admin/mark-overdue").then(unwrap);
export const getStudentHistory = (studentId) => API.get(`/borrow/student/${studentId}/history`).then(unwrap);


