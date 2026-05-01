import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema(
  {
    borrowId: { type: mongoose.Schema.Types.ObjectId, ref: "Borrowing", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment", required: true },
    department: { type: String, required: true },
    year: { type: Number, required: true },
    approverEmail: { type: String, required: true, lowercase: true },
    approverName: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    token: { type: String, required: true, unique: true },
    tokenExpiresAt: { type: Date, required: true },
    decidedAt: { type: Date }
  },
  { timestamps: true }
);

approvalSchema.index({ approverEmail: 1, status: 1 });

const Approval = mongoose.model("Approval", approvalSchema);
export default Approval;
