import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "teacher" | "parent" | "admin";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  schoolName?: string;
  childClassCode?: string;
  avatarColor: string;
  online: boolean;
}

const COLORS = ["#6366f1","#8b5cf6","#ec4899","#14b8a6","#f59e0b","#10b981"];

const UserSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  email:          { type: String, required: true, unique: true, lowercase: true },
  password:       { type: String, required: true, minlength: 8, select: false },
  role:           { type: String, enum: ["teacher","parent","admin"], required: true },
  schoolName:     { type: String },
  childClassCode: { type: String },
  avatarColor:    { type: String, default: () => COLORS[Math.floor(Math.random() * COLORS.length)] },
  online:         { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// ✅ This is the correct fix — avoids the "not callable" error
const User = mongoose.models["User"] ?? mongoose.model("User", UserSchema);
export default User;