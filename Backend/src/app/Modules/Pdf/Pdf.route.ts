import express from 'express';
// import multer from 'multer';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { PDFValidation } from './Pdf.validation';
import { PDFControllers } from './Pdf.controller';

const router = express.Router();

// Use memory storage to avoid saving the file permanently
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

router.post(
  '/create-pdf',
  auth('admin', 'user'),
//   upload.single('file'),
  validateRequest(PDFValidation.addPDFSchema),
  PDFControllers.createPDF,
);

router.get('/:id',auth(), PDFControllers.getSinglePDF);
router.get('/',auth(), PDFControllers.getAllPDFs);
router.get('/file/:fileName',
    // auth(), 
    PDFControllers.getPDFFile);

export const PDFRoutes = router;
