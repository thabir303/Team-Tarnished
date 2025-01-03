// import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';
import { getObjectFromMinIO, uploadToMinIO } from './post.utility';

const bucketName = 'stackoverflow-files';

const createPost = catchAsync(async (req, res) => {
  const { file } = req;
  let postData = null;

  try {
    if (!file) {
      postData = req.body;
    } else {
      const uniqueFileName = `${Date.now()}_${file.originalname}`;
      file.originalname = uniqueFileName
      
      await uploadToMinIO(bucketName, file);
      
      postData = {
        ...req.body,
        fileUrl: `/${bucketName}/${uniqueFileName}`, 
      };
    }

    const result = await PostServices.createPostIntoDB(postData);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Post is created successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'File upload failed' });
  }
});

const getAllPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPostsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Posts are retrieved successfully',
    data: result,
  });
});

const getSinglePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostServices.getSinglePostFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post is retrieved successfully',
    data: result,
  });
});

const getPostFile = catchAsync(async (req, res) => {
  const { fileName } = req.params;
  try {
    const content = await getObjectFromMinIO(bucketName, fileName);
    res.status(200).json({ filename: fileName, content: content });
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve file.', error });
  }
});

export const PostControllers = {
  createPost,
  getSinglePost,
  getAllPosts,
  getPostFile,
};
