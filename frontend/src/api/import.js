import { API } from "./client.js";

export const importCounsellors = (file) => {
  const form = new FormData();
  form.append('file', file);
  return API.post('/import/counsellors', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r=>r.data);
};

export const importTimetable = (file) => {
  const form = new FormData();
  form.append('file', file);
  return API.post('/import/timetable', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r=>r.data);
};
