import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config';


const getChatResponse = async (prompt: string) => {
    const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    return result;
};

export const ChatService = {
  getChatResponse,
};
