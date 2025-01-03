// import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PDFServices } from './Pdf.service';
import { getObjectFromMinIO, uploadToMinIO } from './Pdf.utility';

const bucketName = 'stackoverflow-files';

const createPDF = catchAsync(async (req, res) => {
  const { file } = req;
  console.log(file);
  let PDFData = null;

  try {
    if (!file) {
      PDFData = req.body;
    } else {
      const uniqueFileName = `${Date.now()}_${file.originalname}`;
      file.originalname = uniqueFileName
      
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
