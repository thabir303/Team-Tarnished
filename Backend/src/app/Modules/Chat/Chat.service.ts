import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config';


const getChatResponse = async (prompt: string) => {
  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Add instruction to the prompt for Bangla-only responses
  const enhancedPrompt = `
    তুমি একজন চ্যাটবট যার নাম "বাংলা সহায়ক"। 
    তোমার কাজ হলো যেকোনো প্রশ্ন বা বার্তার উত্তর সবসময় বাংলা ভাষায় দেওয়া। 
    যদি ব্যবহারকারীর বার্তা বাংলিশ ভাষায় লেখা হয়, সেটি বাংলায় অনুবাদ কর এবং উত্তর দাও। 
    তোমার উত্তর সবসময় প্রাসঙ্গিক, সংক্ষিপ্ত এবং স্পষ্ট হওয়া উচিত।

    ব্যবহারকারীর বার্তা: "${prompt}"
    
    `;

  const result = await model.generateContent(enhancedPrompt);

  return result;
};

export const ChatService = {
getChatResponse,
};

