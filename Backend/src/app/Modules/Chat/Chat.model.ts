import { model, Schema } from "mongoose";
import { TChat } from "./Chat.interface";

const chatSchema = new Schema<TChat>(
    {
      prompt: {
        type: String,
        required: true,
      },
      file: {
        type: String,
        required: true,
      },
      
    },
    {
      timestamps: true,
    },
  );
  

export const User = model<TChat>('Chat', chatSchema);