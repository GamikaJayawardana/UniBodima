import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReport extends Document {
  postId: mongoose.Types.ObjectId;
  postType: 'offer' | 'request';
  reportedBy: mongoose.Types.ObjectId;
  reason: string;
  status: 'pending' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema<IReport> = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, required: true },
    postType: { type: String, enum: ['offer', 'request'], required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  },
  { timestamps: true }
);

export const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
