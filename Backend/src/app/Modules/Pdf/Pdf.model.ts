import { model, Schema } from "mongoose";
import { TPdf } from "./Pdf.interface";

const pdfSchema = new Schema<TPdf>(
    {
      caption: {
        type: String,
      },
      content: {
        type: String,
      },
      translatedContent: {
        type: String,
      },
      fileUrl: {
        type: String,
      },
      user: {
        type: Schema.Types.ObjectId,
        unique: false,
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

PDF.syncIndexes();