// src/types/global.d.ts
import mongoose from 'mongoose';

declare global {
  var __mongoose_cache: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
    gfs: mongoose.mongo.GridFSBucket | null;
  };
}
export {}