import mongoose from "mongoose";

const counsellorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    institute: { type: String, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1, max: 6 },
    role: { type: String, enum: ["counsellor", "class_teacher", "hod"], default: "counsellor" },
    phone: { type: String, trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

counsellorSchema.index({ department: 1, year: 1 });
counsellorSchema.index({ email: 1 });

const Counsellor = mongoose.model("Counsellor", counsellorSchema);
export default Counsellor;
