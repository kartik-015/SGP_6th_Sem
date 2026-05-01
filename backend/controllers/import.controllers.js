import xlsx from "xlsx";
import Counsellor from "../models/counsellor.models.js";
import TimetableEntry from "../models/timetable.models.js";
import { parseTimeCell } from "../utils/schedule.js";

function sheetToJson(filePath) {
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  return xlsx.utils.sheet_to_json(ws, { defval: "" });
}

export async function importCounsellors(req, res) {
  if (!req.file) return res.status(400).json({ message: "file required" });
  const rows = sheetToJson(req.file.path);
  let upserts = 0;
  for (const r of rows) {
    const department = (r.Department || r.department || r.Dept || "").toString().trim();
    const year = Number(r.Year || r.year || r.Std || r.SemYear);
    const name = (r.Name || r.name || r.Counsellor || r.Teacher || "").toString().trim();
    const email = (r.Email || r.email || "").toString().trim().toLowerCase();
    const institute = (r.Institute || r.institute || r.College || "").toString().trim();
    const role = ((r.Role || r.role || "counsellor").toString().trim().toLowerCase());
    if (!department || !year || !email) continue;
    await Counsellor.findOneAndUpdate(
      { email, department, year },
      { name, email, institute, department, year, role, active: true },
      { upsert: true, new: true }
    );
    upserts++;
  }
  return res.status(200).json({ success: true, count: upserts });
}

export async function importTimetable(req, res) {
  if (!req.file) return res.status(400).json({ message: "file required" });
  const rows = sheetToJson(req.file.path);
  let inserted = 0;
  const bulk = [];
  for (const r of rows) {
    const institute = (r.Institute || r.institute || "").toString().trim();
    const department = (r.Department || r.department || "").toString().trim();
    const year = Number(r.Year || r.year);
    const semester = Number(r.Semester || r.semester || r.Sem);
    const day = r.Day || r.day || r.DayOfWeek || r.Weekday;
    const dayOfWeek = typeof day === "number" ? day : ["sun","mon","tue","wed","thu","fri","sat"].indexOf(String(day).slice(0,3).toLowerCase());
    const startMin = parseTimeCell(r.Start || r.start || r.From || r.TimeStart);
    const endMin = parseTimeCell(r.End || r.end || r.To || r.TimeEnd);
    const subject = (r.Subject || r.subject || r.Course || "").toString().trim();
    const teacherName = (r.Teacher || r.teacher || r.Faculty || "").toString().trim();
    const teacherEmail = (r.TeacherEmail || r.teacherEmail || r.Email || "").toString().trim().toLowerCase();
    const room = (r.Room || r.room || r.Class || "").toString().trim();
    if (!department || !year || dayOfWeek < 0 || startMin == null || endMin == null) continue;
    bulk.push({
      insertOne: {
        document: { institute, department, year, semester: semester || undefined, dayOfWeek, startMin, endMin, subject, teacherName, teacherEmail, room }
      }
    });
    if (bulk.length >= 1000) {
      await TimetableEntry.bulkWrite(bulk);
      inserted += bulk.length;
      bulk.length = 0;
    }
  }
  if (bulk.length) {
    await TimetableEntry.bulkWrite(bulk);
    inserted += bulk.length;
  }
  return res.status(200).json({ success: true, inserted });
}
