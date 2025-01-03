import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { pdfSearchableFields } from './Pdf.constant';
import { TPdf } from './Pdf.interface';
import { PDF } from './Pdf.model';

const createPDFIntoDB = async (payload: TPdf) => {

  try {

    const result = await PDF.create([payload]);

    if (!result) {
      throw new AppError(400, 'Failed to create PDF');
    } 

    return result[0];
  } catch (err) {
    throw new AppError(400, 'Failed to create PDF');
  }
};

const getAllPDFsFromDB = async (query: Record<string, unknown>) => {
  const PDFQuery = new QueryBuilder(PDF.find().populate('user'), query)
    .search(pdfSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await PDFQuery.modelQuery;
  return result;
};

const getSinglePDFFromDB = async (id: string) => {
  const result = await PDF.findById(id).populate('user');
  return result;
};

export const PDFServices = {
  createPDFIntoDB,
  getAllPDFsFromDB,
  getSinglePDFFromDB,
};
