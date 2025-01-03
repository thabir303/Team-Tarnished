import express from 'express';
import multer from 'multer';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ChatValidation } from './Chat.validation';

const router = express.Router();

// Use memory storage to avoid saving the file permanently
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/chat',
  auth(),
  upload.single('file'), // Specify the field name to be 'file'
  validateRequest(ChatValidation.addChatSchema),
  PostControllers.createPost,
);

// router.get('/:id',auth(), PostControllers.getSinglePost);
// router.get('/',auth(), PostControllers.getAllPosts);
router.get('/file/:fileName',auth(), PostControllers.getPostFile);

export const PostRoutes = router;
