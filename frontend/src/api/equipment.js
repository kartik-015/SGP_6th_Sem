import { API } from "./client.js";

export const getEquipment = (params) => API.get("/equipment", { params }).then(r => r.data?.data || r.data);
export const createEquipment = (data) => API.post("/equipment", data).then(r => r.data);
export const updateEquipment = (id, data) => API.put(`/equipment/${id}`, data).then(r => r.data);
export const deleteEquipment = (id) => API.delete(`/equipment/${id}`).then(r => r.data);


