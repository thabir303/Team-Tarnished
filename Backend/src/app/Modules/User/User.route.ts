import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './User.validation';
import { UserControllers } from './User.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-user',
  auth('admin'),
  validateRequest(UserValidation.addUserSchema),
  UserControllers.createUser,
);

router.get('/:id', auth('admin'), UserControllers.getSingleUser);

router.get('/', auth('admin','editor'), UserControllers.getAllUsers);

router.patch(
  '/:userId',
  auth('admin'),
  validateRequest(UserValidation.updateUserSchema),
  UserControllers.updateUser,
);

router.delete('/:userId', auth('admin'), UserControllers.deleteUser);

export const UserRoutes = router;
