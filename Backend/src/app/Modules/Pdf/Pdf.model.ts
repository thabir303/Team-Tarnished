import { model, Schema } from "mongoose";
import { TPdf } from "./Pdf.interface";

const pdfSchema = new Schema<TPdf>(
    {
      caption: {
        type: String,
        required: true,
      },
      content: {
        type: String,
      },
      fileUrl: {
        type: String,
        required: true,
        unique: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User id is required'],
        unique: true,
        ref: 'User',
      },
      transparency: {
        type: String,
        enum: ['public', 'private'],
        default:'public'
      },
      
    },
    {
      timestamps: true,
    },
  );
  

export const PDF = model<TPdf>('PDF', pdfSchema);