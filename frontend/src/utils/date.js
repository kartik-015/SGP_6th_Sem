export const addDays = (isoDateString, days) => {
  const d = isoDateString ? new Date(isoDateString) : new Date();
  d.setDate(d.getDate() + Number(days || 0));
  return d.toISOString().slice(0, 10);
};

export const daysLate = (dueDateIso) => {
  const due = new Date(dueDateIso);
  const now = new Date();
  const diff = Math.floor((now - due) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

export const calculatePenalty = (dueDateIso, ratePerDay = 10) => {
  return daysLate(dueDateIso) * ratePerDay;
};


