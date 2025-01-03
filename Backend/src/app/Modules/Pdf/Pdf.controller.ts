// import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PDFServices } from './Pdf.service';
import { getObjectFromMinIO, uploadToMinIO } from './Pdf.utility';
import { GoogleGenerativeAI } from "@google/generative-ai";
import jsPDF from "jspdf";

const bucketName = 'stackoverflow-files';

// const getCaption = async (content as string) => {
//     const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY as string);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const enhancedPrompt = `
//         The following text is written in Bangla. Write a caption in 3-4 words and provide your response strictly in Bangla:
//          "${content}"
//         `;

//     const result = await model.generateContent(enhancedPrompt);

//     return result;
//   };

  const getTranslation = async (content) => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const enhancedPrompt = `
        The following text is written in Banglish. Convert it to Bangla and provide your response strictly in Bangla:
         "${content}"
        `;

    const result = await model.generateContent(enhancedPrompt);

    return result;
  };

//   const generatePdfFromContent = async (geminiTranslation) => {
//     // console.log(geminiTranslation);
//     // Define the PDF document
//     const pdf = new jsPDF();

//     pdf.setFont("Helvetica", "normal");
//     pdf.setFontSize(12);
//     pdf.text(geminiTranslation, 10, 10, { maxWidth: 180 });
//     return pdf.output("blob");
//   };

const createPDF = catchAsync(async (req, res) => {
    console.log(req.body);
    const { content } = req.body;
    let PDFData = null;
  
    try {
      if (!file) {
        PDFData = req.body;
      } else {
        // Decode the original name to handle Bangla characters
        file.originalname = decodeURIComponent(file.originalname);
  
        const uniqueFileName = `${Date.now()}_${file.originalname}`;
        file.originalname = uniqueFileName;
        
        await uploadToMinIO(bucketName, file);
        
        PDFData = {
          ...req.body,
          fileUrl: `/${bucketName}/${uniqueFileName}`, 
        };
      }
  
      const result = await PDFServices.createPDFIntoDB(PDFData);
  
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'PDF is created successfully',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'File upload failed' });
    }
  });

const getAllPDFs = catchAsync(async (req, res) => {
  const result = await PDFServices.getAllPDFsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'PDFs are retrieved successfully',
    data: result,
  });
});

const getSinglePDF = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PDFServices.getSinglePDFFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'PDF is retrieved successfully',
    data: result,
  });
});

const getPDFFile = catchAsync(async (req, res) => {
  const { fileName } = req.params;
  try {
    const content = await getObjectFromMinIO(bucketName, fileName);
    res.status(200).json({ filename: fileName, content: content });
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve file.', error });
  }
});

export const PDFControllers = {
  createPDF,
  getSinglePDF,
  getAllPDFs,
  getPDFFile,
};
