import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name:       { type: String, required: true },
  email:      { type: String, required: true },
  schoolName: { type: String, required: true },
  avatarColor:{ type: String, default: "#6366f1" },
  stats: {
    totalStudents:      { type: Number, default: 0 },
    avgAttendance:      { type: Number, default: 0 },
    pendingAssignments: { type: Number, default: 0 },
    atRiskStudents:     { type: Number, default: 0 },
  },
  recentActivity: [{
    text: String,
    time: String,
    type: { type: String, enum: ["attendance","grade","message","alert"], default: "grade" },
  }],
}, { timestamps: true });

export default mongoose.models.Teacher ?? mongoose.model("Teacher", TeacherSchema);