import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // item name, e.g., "Cricket Bat"
  sport: { type: String, required: true }, // sport name, e.g., "cricket"
  category: { type: String }, // optional sub-category/model
  barcode: { type: String, required: true, unique: true },
  status: { type: String, enum: ["available", "borrowed", "maintenance"], default: "available" },
  quantity: { type: Number, default: 1, min: 0 },
  available: { type: Number, default: 1, min: 0 },
  imageUrl: { type: String },
  price: { type: Number, required: true }
}, { timestamps: true })

// Ensure a unique barcode exists; auto-generate if missing
equipmentSchema.pre('validate', function(next) {
  if (!this.barcode) {
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    const ts = Date.now().toString(36).toUpperCase();
    this.barcode = `EQ-${ts}-${rand}`;
  }
  next();
});

const Equipments =  mongoose.model("Equipment", equipmentSchema);
export default Equipments