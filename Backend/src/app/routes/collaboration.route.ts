import { Router } from 'express';
import { CollaborationController } from '../Modules/Collaboration/Collaboration.controller';

const router = Router();

router.post('/invite', CollaborationController.inviteCollaborator);
router.post('/accept', CollaborationController.acceptInvitation);

export default router;
