import { Schema, model } from 'mongoose';

const documentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    collaborators: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    invitedUsers: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Document = model('Document', documentSchema);
