import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  groupId:  mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content:  string;
  read:     boolean;
}

const MessageSchema = new Schema<IMessage>({
  groupId:  { type: Schema.Types.ObjectId, ref: "Group", required: true },
  senderId: { type: Schema.Types.ObjectId, ref: "User",  required: true },
  content:  { type: String, required: true },
  read:     { type: Boolean, default: false },
}, { timestamps: true });

// Index for fast message fetching per group
MessageSchema.index({ groupId: 1, createdAt: 1 });

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);