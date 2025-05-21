// models/TemporaryUser.ts
import mongoose, { Schema, model, models } from 'mongoose';

const TemporaryUserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String, // already hashed
  phoneNumber: String,
  address: String,
  role: String,
  verificationToken: String,
  createdAt: { type: Date, default: Date.now },
});

const TemporaryUser = models.TemporaryUser || model('TemporaryUser', TemporaryUserSchema);

export default TemporaryUser;
