import mongoose from "mongoose";

// Store timetable entries as minutes from midnight for easy range checks
const timetableEntrySchema = new mongoose.Schema(
  {
    institute: { type: String, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1, max: 6 },
    semester: { type: Number, min: 1, max: 8 },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 }, // 0=Sun..6=Sat
    startMin: { type: Number, required: true, min: 0, max: 24 * 60 - 1 },
    endMin: { type: Number, required: true, min: 1, max: 24 * 60 },
    subject: { type: String, trim: true },
    teacherName: { type: String, trim: true },
    teacherEmail: { type: String, trim: true, lowercase: true },
    room: { type: String, trim: true },
    group: { type: String, trim: true }
  },
  { timestamps: true }
);

timetableEntrySchema.index({ department: 1, year: 1, semester: 1, dayOfWeek: 1, startMin: 1 });

const TimetableEntry = mongoose.model("TimetableEntry", timetableEntrySchema);
export default TimetableEntry;
