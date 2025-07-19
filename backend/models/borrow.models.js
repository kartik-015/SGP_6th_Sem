import mongoose from 'mongoose';

// Borrowing Schema
 const borrowingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment", required: true },
  borrowedAt: { type: Date, default: Date.now },
  returnBy: { type: Date, required: true },
  returnedAt: { type: Date },
  status: { 
    type: String, 
    enum: ["active", "returned", "late"], 
    default: "active" 
  }
});

export default mongoose.model("Borrowing", borrowingSchema);