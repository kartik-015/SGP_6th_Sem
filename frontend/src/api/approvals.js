import { API } from "./client.js";

export const getApproval = (token) => API.get(`/approvals/${token}`).then(r=>r.data);
export const decideApproval = (token, decision) => API.post(`/approvals/${token}/decide`, { decision }).then(r=>r.data);
