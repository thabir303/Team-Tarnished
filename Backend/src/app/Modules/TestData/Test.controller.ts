// import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TestServices } from './Test.service';
import { getObjectFromMinIO, uploadToMinIO } from './Test.utility';

const bucketName = 'stackoverflow-files';

const createTest = catchAsync(async (req, res) => {
  const { file } = req;
  let TestData = null;

  try {
    if (!file) {
      TestData = req.body;
    } else {
      const uniqueFileName = `${Date.now()}_${file.originalname}`;
      file.originalname = uniqueFileName
      
      await uploadToMinIO(bucketName, file);
      
      TestData = {
        ...req.body,
        fileUrl: `/${bucketName}/${uniqueFileName}`, 
      };
    }

    const result = await TestServices.createTestIntoDB(TestData);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Test is created successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'File upload failed' });
  }
});

const getAllTests = catchAsync(async (req, res) => {
  const result = await TestServices.getAllTestsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tests are retrieved successfully',
    data: result,
  });
});

const getSingleTest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TestServices.getSingleTestFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Test is retrieved successfully',
    data: result,
  });
});

const getTestFile = catchAsync(async (req, res) => {
  const { fileName } = req.params;
  try {
    const content = await getObjectFromMinIO(bucketName, fileName);
    res.status(200).json({ filename: fileName, content: content });
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve file.', error });
  }
});

export const TestControllers = {
  createTest,
  getSingleTest,
  getAllTests,
  getTestFile,
};
