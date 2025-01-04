import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './User.validation';
import { UserControllers } from './User.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-user',
  validateRequest(UserValidation.addUserSchema),
  UserControllers.createUser,
);

router.get('/:id',
   auth('admin', 'user'), 
UserControllers.getSingleUser);

router.get('/', 
  auth('admin','user'),
 UserControllers.getAllUsers);

router.patch(
  '/:userId',
  auth(),
  UserControllers.updateUser,
);

router.delete('/:userId', auth('admin'), UserControllers.deleteUser);

export const UserRoutes = router;
