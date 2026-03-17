import mongoose, { Schema, Document } from "mongoose";

export interface IGroupMember {
  userId:  mongoose.Types.ObjectId;
  role:    string;  // their role in this group context
}

export interface IGroup extends Document {
  name:        string;
  description: string;
  isGroup:     boolean;   // false = DM, true = group chat
  createdBy:   mongoose.Types.ObjectId;
  members:     IGroupMember[];
}

const GroupSchema = new Schema<IGroup>({
  name:        { type: String, required: true },
  description: { type: String, default: "" },
  isGroup:     { type: Boolean, default: true },
  createdBy:   { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    role:   { type: String, enum: ["ADMIN","TEACHER","PARENT","STUDENT"] },
  }],
}, { timestamps: true });

export default mongoose.models.Group || mongoose.model<IGroup>("Group", GroupSchema);