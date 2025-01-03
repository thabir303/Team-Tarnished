import { Router } from 'express';
import { UserRoutes } from '../Modules/User/User.route';
import { ChatRoutes } from '../Modules/Chat/Chat.route';

const router = Router();

const moduleRoutes = [
  
  {
    path: '/user',
    route: UserRoutes
  },
  {
    path: '/chat',
    route: ChatRoutes
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;