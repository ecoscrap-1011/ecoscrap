import mongoose, { Schema, models, model } from 'mongoose';

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ASSIGNED = 'ASSIGNED',
  EN_ROUTE = 'EN_ROUTE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export interface IScrapRequest extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  scrapTypeId: mongoose.Types.ObjectId;
  weightKg: number;
  status: RequestStatus;
  price?: number; // ✅ now optional
  pickupDate: Date;
  pickupAddress: string;
  staffId?: mongoose.Types.ObjectId;
  imageUrl?: string;
  proofOfCollectionUrl?: string;
  notes?: string;
  feedback?: string;
  feedbackRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ScrapRequestSchema = new Schema<IScrapRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scrapTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'ScrapType',
      required: true,
    },
    weightKg: {
      type: Number,
      required: [true, 'Please provide weight in kg'],
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.PENDING,
    },
    price: {
      type: Number,
      min: 0,
      required: false, // ✅ made optional
    },
    pickupDate: {
      type: Date,
      required: [true, 'Please provide pickup date'],
    },
    pickupAddress: {
      type: String,
      required: [true, 'Please provide pickup address'],
      trim: true,
    },
    staffId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    proofOfCollectionUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    feedback: {
      type: String,
      trim: true,
    },
    feedbackRating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

const ScrapRequest = models.ScrapRequest || model<IScrapRequest>('ScrapRequest', ScrapRequestSchema);

export default ScrapRequest;
