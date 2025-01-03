import { Request, Response } from 'express';
import { CollaborationService } from './Collaboration.service';

export const CollaborationController = {
  inviteCollaborator: async (req: Request, res: Response) => {
    const { documentId, inviterId, inviteeEmail } = req.body;
    try {
      await CollaborationService.inviteCollaborator(documentId, inviterId, inviteeEmail);
      res.status(200).json({ success: true, message: 'Invitation sent!' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  acceptInvitation: async (req: Request, res: Response) => {
    const { documentId, userId } = req.body;
    try {
      await CollaborationService.acceptInvitation(documentId, userId);
      res.status(200).json({ success: true, message: 'Invitation accepted!' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
