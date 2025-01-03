import { Router } from 'express';
import { UserRoutes } from '../Modules/User/User.route';
import { ChatRoutes } from '../Modules/Chat/Chat.route';
import { PDFRoutes } from '../Modules/Pdf/Pdf.route';
import { Enhance } from '../Modules/Enhance/Enhance.autocorrect.route';

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
    path: '/enhance',
    route: Enhance
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;