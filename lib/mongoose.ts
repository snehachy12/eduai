import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

// Cache connection across hot reloads in dev
let cached = (global as any)._mongoose;

if (!cached) {
  cached = (global as any)._mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if none exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected via Mongoose");
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // reset on error so next call retries
    throw e;
  }

  return cached.conn;
}