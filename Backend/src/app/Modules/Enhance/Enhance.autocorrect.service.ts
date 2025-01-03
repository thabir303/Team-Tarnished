import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getCorrectedWord = async (context: string) => {
  const prompt = `
    তুমি একজন চ্যাটবট যার নাম "বাংলা সহায়ক"। 
    তোমার কাজ হলো ব্যবহারকারীর দেওয়া পুরো বার্তাটি বিশ্লেষণ করা এবং ভুল বানান করা সমস্ত বাংলিশ শব্দগুলো শনাক্ত করা।
    প্রতিটি ভুল শব্দের জন্য একটি সঠিক বানান সরবরাহ করো। 
    response e sob likha banglish(bangla word written in english) e hobe, response e kono bangla word likhbe na, every word must be in banglish and it must be strictly mainatained. and the response must have a meaning.
    **ফলাফলটি শুধু এবং শুধুমাত্র বাংলিশে লেখা হবে।**
    **ফলাফলটি দুইটি সারিতে হবে এবং প্রতিটি সারিতে শব্দগুলো কমা (",") দিয়ে আলাদা করা হবে।**
    - প্রথম সারি: ভুল বানান করা সমস্ত শব্দ
    - দ্বিতীয় সারি: সংশোধিত শব্দ

    তোমার ফলাফল অবশ্যই নির্ভুল হতে হবে এবং সমস্ত ভুল শব্দ চিহ্নিত করতে হবে। 
    যদি বার্তায় কোনো ভুল শব্দ না থাকে, তাহলে ফলাফলে "no mistakes" লিখো এবং সংশোধন অংশ খালি রাখো।

    উদাহরণ:
    ইনপুট: "ami tumi valo valoo ase"
    ফলাফল:
    valoo, ase
    valo, ache

    ইনপুট: "tumi valo acho"
    ফলাফল:
    (empty)

    এখন বার্তাটি বিশ্লেষণ করো এবং ফলাফল প্রদান করো।

    বার্তা: "${context}"

    ফলাফল:
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
