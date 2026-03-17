import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  teacherId:       { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  name:            { type: String, required: true },
  initials:        { type: String, required: true },
  section:         { type: String, required: true },
  classCode:       { type: String, required: true, unique: true },
  avatarColor:     { type: String, default: "#6366f1" },
  attendance:      { type: Number, default: 100 },
  avgScore:        { type: Number, default: 0 },
  status:          { type: String, enum: ["excellent","good","at-risk","critical"], default: "good" },
  teacherFeedback: { type: String, default: "" },
  subjects: [{
    name:  String,
    score: Number,
    color: String,
  }],
}, { timestamps: true });

StudentSchema.index({ teacherId: 1 });
StudentSchema.index({ classCode: 1 });

export default mongoose.models.Student ?? mongoose.model("Student", StudentSchema);