// import httpStatus from 'http-status';
import fs from 'fs';
import path from 'path';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PDFServices } from './Pdf.service';
import { getObjectFromMinIO, uploadToMinIO } from './Pdf.utility';
import { GoogleGenerativeAI } from '@google/generative-ai';
import jsPDF from 'jspdf';
import { Buffer } from 'buffer';
// import fontBengali from './NotoSansBengali-Regular-normal';
import fontBengali from '../../utils/NotoSansBengali-Regular-normal'

const bucketName = 'stackoverflow-files';

const getCaption = async (content) => {
  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const enhancedPrompt = `The following text is written in Bangla. Write a caption in 3-4 words and provide your response strictly in Bangla:
         "${content}"`;
  const result = await model.generateContent(enhancedPrompt);

  return result;
};

const getTranslation = async (content) => {
  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const enhancedPrompt = `
        The following text is written in Banglish. Convert it to Bangla and provide your response strictly in Bangla:
         "${content}"
        `;

  const result = await model.generateContent(enhancedPrompt);

  return result;
};

const generatePdfFromContent = async (geminiTranslation) => {
    // Create a new jsPDF instance
    const pdf = new jsPDF();
  
    // Add the custom font to jsPDF
    pdf.addFileToVFS("NotoSansBengali-Regular.ttf", fontBengali);
    pdf.addFont("NotoSansBengali-Regular.ttf", "NotoSansBengali", "normal");
  
    // Set the font to the Bangla font
    pdf.setFont("NotoSansBengali");
  
    // Set font size
    pdf.setFontSize(12);
  
    // Add the translated content (Bangla text) to the PDF
    pdf.text(geminiTranslation, 10, 10, { maxWidth: 180 });
  
    // Generate the PDF as a Blob
    const pdfBlob = pdf.output('blob');
  
    // Convert the Blob to a Buffer
    const buffer = Buffer.from(await pdfBlob.arrayBuffer());
    
    return buffer;
  };

const createPDF = catchAsync(async (req, res) => {
    const { content } = req.body;
  
    // Create a temporary file path relative to the current working directory
    const tempFilePath = path.join(process.cwd(), `${Date.now()}_temp.pdf`);
    try {
      const translatedContent = await getTranslation(content);
    //   console.log(translatedContent?.response?.candidates[0].content.parts[0].text);
      let caption = await getCaption(content);
      caption = caption?.response?.candidates[0].content.parts[0].text;
    //   console.log(caption);
      const pdfBuffer = await generatePdfFromContent(translatedContent?.response?.candidates[0].content.parts[0].text);

  
      await fs.promises.writeFile(tempFilePath, pdfBuffer);
  
      const file = {
        path: tempFilePath,
        originalname: `${Date.now()}_translated.pdf`,
        buffer: pdfBuffer,
        size: Buffer.byteLength(pdfBuffer),
      };

    //   console.log(file);
  
      await uploadToMinIO(bucketName, file);
  
      const fileUrl = `/${bucketName}/${file.originalname}`;
  
      const PDFData = {
        ...req.body,
        caption,
        fileUrl,
      };
  
      const result = await PDFServices.createPDFIntoDB(PDFData);
  
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'PDF is created successfully',
        data: result,
      });
    }
    finally {
      // Ensure the temporary file is deleted
      if (fs.existsSync(tempFilePath)) {
        await fs.promises.unlink(tempFilePath);
      }
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