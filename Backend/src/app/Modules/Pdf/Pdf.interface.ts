import { Types } from 'mongoose';

export interface TPdf {
  caption: string;
  content: string;
//   translatedContent: string;
  user: Types.ObjectId;
  transparency: 'public' | 'private';
}
