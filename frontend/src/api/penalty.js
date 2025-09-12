import { API } from "./client.js";

export const listPenalties = (params) => API.get("/penalty", { params }).then(r => r.data);
export const addPenalty = (data) => API.post("/penalty", data).then(r => r.data);
export const settlePenalty = (id, data) => API.post(`/penalty/${id}/settle`, data).then(r => r.data);


