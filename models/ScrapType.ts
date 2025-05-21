import mongoose, { Schema, models, model } from 'mongoose';

export interface IScrapType extends mongoose.Document {
  name: string;
  description: string;
  pricePerKg: number;
  isActive: boolean;
  imageUrl?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ScrapTypeSchema = new Schema<IScrapType>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    pricePerKg: {
      type: Number,
      required: [true, 'Please provide price per kg'],
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const ScrapType = models.ScrapType || model<IScrapType>('ScrapType', ScrapTypeSchema);

export default ScrapType;