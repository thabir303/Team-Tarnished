import { User } from '../User/User.model';
import { Document } from '../Document/Document.model';

export const CollaborationService = {
  inviteCollaborator: async (documentId: string, inviterId: string, inviteeEmail: string) => {
    const invitee = await User.findOne({ email: inviteeEmail });
    if (!invitee) throw new Error('Invitee not found!');

    await Document.updateOne(
      { _id: documentId },
      { $push: { invitedUsers: invitee._id } }
    );
  },

  acceptInvitation: async (documentId: string, userId: string) => {
    await Document.updateOne(
      { _id: documentId },
      { $push: { collaborators: userId }, $pull: { invitedUsers: userId } }
    );
  },
};
