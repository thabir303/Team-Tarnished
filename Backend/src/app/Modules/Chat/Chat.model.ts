import { model, Schema } from "mongoose";
import { TChat } from "./Chat.interface";

const chatSchema = new Schema<TChat>(
    {
      prompt: {
        type: String,
        required: true,
      },
      extractedText: {
        type: String,
      },
      response: {
        type: String,
        required: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User id is required'],
        unique: true,
        ref: 'User',
      },
      
    },
    {
      timestamps: true,
    },
  );
  

export const User = model<TChat>('Chat', chatSchema);