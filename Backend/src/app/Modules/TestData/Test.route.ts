import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { TestValidation } from './Test.validation';
import multer from 'multer';
import { TestControllers } from './Test.controller';

const router = express.Router();

// Use memory storage to avoid saving the file permanently
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/create-test',
  auth('admin', 'user'),
  upload.single('file'),
  validateRequest(TestValidation.addTestSchema),
  TestControllers.createTest,
);

router.get('/:id',auth(), TestControllers.getSingleTest);
router.get('/',auth(), TestControllers.getAllTests);
router.get('/file/:fileName',
    // auth(), 
    TestControllers.getTestFile);

export const TestRoutes = router;
