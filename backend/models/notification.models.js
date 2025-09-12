import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    item : {type : mongoose.Schema.Types.ObjectId , ref: "Equipment", required: true },
    seen : { type: Boolean, default: false },
    duration : { type: Number, required: true },
},
{
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

export const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;