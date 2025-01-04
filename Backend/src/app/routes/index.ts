import { Router } from 'express';
import { UserRoutes } from '../Modules/User/User.route';
import { ChatRoutes } from '../Modules/Chat/Chat.route';
import { PDFRoutes } from '../Modules/Pdf/Pdf.route';
import { Enhance } from '../Modules/Enhance/Enhance.autocorrect.route';
import collaborationRoutes from './collaboration.route';
import { TestRoutes } from '../Modules/TestData/Test.route';

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
  {
    path: '/pdf',
    route: PDFRoutes
  },
  {
    path: '/test',
    route: TestRoutes
  },
  {
    path: '/enhance',
    route: Enhance
  },
  {
    path: '/collaboration',
    route: collaborationRoutes
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;