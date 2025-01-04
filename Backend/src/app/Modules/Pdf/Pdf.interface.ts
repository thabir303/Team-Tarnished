import { Types } from 'mongoose';
import { PDF_Transparency } from './Pdf.constant';

export interface TPdf {
  caption: string;
  content: string;
  translatedContent: string;
  fileUrl: string;
  user: Types.ObjectId;
  transparency: 'public' | 'private';
}

export type T_PDF_Transparency = keyof typeof PDF_Transparency;
