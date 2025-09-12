import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    
    notification : { type: mongoose.Schema.Types.ObjectId, ref: "Notification", required: true },
    status: { 
    type: String, 
    enum: ["available", "borrowed", "maintenance"], 
    default: "available" 
  },
   // duration in days
}
,
{
    timestamps: true // Automatically adds createdAt and updatedAt fields
}
)

const Request = mongoose.model("Request", requestSchema);
export default Request;