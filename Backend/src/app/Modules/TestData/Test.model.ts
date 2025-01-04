import { model, Schema } from "mongoose";
import { TTest } from "./Test.interface";

const pdfSchema = new Schema<TTest>(
    {
      accepted: {
        type: Boolean,
        default: false,
      },
      fileUrl: {
        type: String,
      },
    },
    {
      timestamps: true,
    },
  );
  

export const Test = model<TTest>('Test', pdfSchema);

Test.syncIndexes();