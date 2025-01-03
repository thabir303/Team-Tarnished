import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ChatValidation } from './Chat.validation';
import { ChatControllers } from './Chat.controller';

const router = express.Router();

// Use memory storage to avoid saving the file permanently
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

router.post(
  '/get-chat-response',
  // auth('admin', 'user'),
  // upload.single('file'), // Specify the field name to be 'file'
  validateRequest(ChatValidation.addChatSchema),
  ChatControllers.chatResponse,
);

// router.get('/:id',auth(), PostControllers.getSinglePost);
// router.get('/',auth(), PostControllers.getAllPosts);
// router.get('/file/:fileName',auth(), PostControllers.getPostFile);

export const ChatRoutes = router;
