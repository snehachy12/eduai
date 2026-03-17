import mongoose from "mongoose";

const ParentSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name:           { type: String, required: true },
  email:          { type: String, required: true },
  childClassCode: { type: String, required: true },
  studentId:      { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
  avatarColor:    { type: String, default: "#8b5cf6" },
  stats: {
    childName:     { type: String, default: "" },
    grade:         { type: String, default: "" },
    attendance:    { type: Number, default: 0 },
    homeworkDone:  { type: Number, default: 0 },
    homeworkTotal: { type: Number, default: 0 },
    avgScore:      { type: Number, default: 0 },
  },
}, { timestamps: true });

export default mongoose.models.Parent ?? mongoose.model("Parent", ParentSchema);