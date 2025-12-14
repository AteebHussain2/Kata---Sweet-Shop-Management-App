import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables!");
}

/* eslint-disable no-var */
declare global {
  var mongoose: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null };
}
/* eslint-enable no-var */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGO_URI as string, {
        dbName: "Kata",
        bufferCommands: false,
      } as mongoose.ConnectOptions)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully!");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
