import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema({

      name: { type: String, required: true },
  barcode: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["available", "borrowed", "maintenance"], 
    default: "available" 
  },
  imageUrl: { type: String }    

})

export default mongoose.model("Equipment", equipmentSchema);