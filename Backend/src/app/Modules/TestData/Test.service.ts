import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Test } from './Test.model';
import { TTest } from './Test.interface';

const createTestIntoDB = async (payload: TTest) => {
  

    const result = await Test.create([payload]);

    if (!result) {
      throw new AppError(400, 'Failed to create Test');}
};

const getAllTestsFromDB = async (query: Record<string, unknown>) => {
  const TestQuery = new QueryBuilder(Test.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await TestQuery.modelQuery;
  return result;
};

const getSingleTestFromDB = async (id: string) => {
  const result = await Test.findById(id);
  return result;
};

export const TestServices = {
  createTestIntoDB,
  getAllTestsFromDB,
  getSingleTestFromDB,
};
