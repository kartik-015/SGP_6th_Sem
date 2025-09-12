import { API } from "./client.js";

export const processScan = (payload) => API.post("/scanner/process", payload).then(r => r.data);


