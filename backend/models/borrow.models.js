import mongoose from 'mongoose';

// Borrowing Schema
 const borrowingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment", required: true },
  borrowedAt: { type: Date, default: Date.now },
  returnBy: { type: Date, required: true },
  returnedAt: { type: Date },
  imageUrl: { type: String },
  count: { type: Number, default: 1, min: 1 },
  penaltyAmount: { type: Number, default: 0 },
  penaltyPaid: { type: Boolean, default: false },
  verifiedName: { type: String },
  verifiedPhone: { type: String },
  status: { 
    type: String, 
    enum: ["pending", "active", "returned", "overdue", "never_returned", "denied"], 
    default: "active" 
  }
}, { timestamps: true });

export default mongoose.model("Borrowing", borrowingSchema);