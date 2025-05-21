import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing from environment variables!");
}

// Extend the global object with a unique cache property
declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    gfs: mongoose.mongo.GridFSBucket | null;
  };
}

// Initialize cache if it doesn't exist
global.__mongoose_cache = global.__mongoose_cache || { conn: null, promise: null, gfs: null };
const cached = global.__mongoose_cache;

export const dbConnect = async (): Promise<typeof mongoose> => {
  if (cached.conn) {
    console.info("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.info("⏳ Connecting to MongoDB...");

    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => {
        console.info(`✅ MongoDB Connected: ${mongooseInstance.connection.host}`);

        const db = mongooseInstance.connection.db;
        if (!db) {
          throw new Error("MongoDB connection.db is not available");
        }

        cached.gfs = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });

        return mongooseInstance;
      })
      .catch((error: any) => {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset promise on failure
    throw error;
  }

  return cached.conn;
};

// Get the cached GridFSBucket instance
export const getGFS = (): mongoose.mongo.GridFSBucket => {
  if (!cached.gfs) {
    throw new Error("❌ GridFSBucket is not initialized!");
  }
  return cached.gfs;
};

// Get a new GridFSBucket instance (if needed)
export const getBucket = (): mongoose.mongo.GridFSBucket => {
  if (!cached.conn) {
    throw new Error("❌ No MongoDB connection available to get bucket");
  }

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("MongoDB connection.db is not available");
  }

  return new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
};
