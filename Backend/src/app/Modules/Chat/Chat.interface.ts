import { Types } from 'mongoose';

export interface TChat {
  prompt: string;
  extractedText: string;
  user: Types.ObjectId;
  response: string;
}
