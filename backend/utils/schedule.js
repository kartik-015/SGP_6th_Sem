import TimetableEntry from "../models/timetable.models.js";

function toMinutes(hhmm) {
  if (typeof hhmm === "number") return hhmm;
  if (!hhmm) return null;
  const [h, m] = String(hhmm).split(":");
  const hh = Number(h);
  const mm = Number(m || 0);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return hh * 60 + mm;
}

export function nowLocal() {
  const d = new Date();
  return { day: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes(), date: d };
}

export async function isStudentFreeNow(user) {
  if (!user?.department || !user?.year) {
    return { free: false, reason: "missing_profile" };
  }
  const { day, minutes } = nowLocal();
  const query = {
    department: user.department,
    year: user.year,
    dayOfWeek: day,
    startMin: { $lte: minutes },
    endMin: { $gt: minutes },
  };
  if (user.semester) query.semester = user.semester;
  const slot = await TimetableEntry.findOne(query).lean();
  if (!slot) return { free: true };
  return { free: false, slot };
}

export function parseTimeCell(value) {
  if (typeof value === "number") return value; // minutes
  if (!value) return null;
  // Try formats like '09:30', '9.30', '09:30 AM'
  let v = String(value).trim().replace(/\./g, ":");
  const ampm = /\s*(AM|PM)$/i.exec(v)?.[1]?.toUpperCase();
  v = v.replace(/\s*(AM|PM)$/i, "");
  const mins = toMinutes(v);
  if (mins == null) return null;
  if (!ampm) return mins;
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + m;
}
