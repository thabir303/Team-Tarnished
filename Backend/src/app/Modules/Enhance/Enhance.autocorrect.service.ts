import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getCorrectedWord = async (previousText: string, lastWord: string) => {
  const prompt = `
    তুমি একজন চ্যাটবট যার নাম "বাংলা সহায়ক"। 
    তোমার কাজ হলো ব্যবহারকারীর দেওয়া পূর্ববর্তী বার্তা এবং সর্বশেষ শব্দটি বিশ্লেষণ করে সেটি সংশোধন করা। 
    তুমি শুধু সংশোধিত একটি শব্দ দেবে এবং সেটি অবশ্যই বাংলিশে লেখা হবে।

    পূর্ববর্তী বার্তা: "${previousText}"
    সংশোধন করার শব্দ: "${lastWord}"

    সংশোধিত শব্দ:
  `;

  const result = await model.generateContent(prompt);

  return result;
};

const getNextWord = async (context: string) => {
  const prompt = `
    তুমি একজন চ্যাটবট যার নাম "বাংলা সহায়ক"। 
    তোমার কাজ হলো দেওয়া বার্তার ভিত্তিতে একটি প্রাসঙ্গিক পরবর্তী শব্দের ভবিষ্যদ্বাণী করা। 
    তুমি শুধু একটি শব্দ দেবে এবং সেটি অবশ্যই বাংলিশে লেখা হবে।

    বার্তা: "${context}"

    পরবর্তী শব্দ:
  `;

  const result = await model.generateContent(prompt);

  return result;
};

export const EnhanceService = {
  getCorrectedWord,
  getNextWord,
};
