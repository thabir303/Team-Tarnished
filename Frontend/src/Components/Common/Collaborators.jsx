import React, { useState } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const Collaborators = ({ documentId }) => {
  const axiosSecure = useAxiosSecure();
  const [inviteeEmail, setInviteeEmail] = useState('');

  const handleInvite = async () => {
    try {
      await axiosSecure.post('/api/v1/collaboration/invite', {
        documentId,
        inviterId: 'currentUserId',
        inviteeEmail,
      });
      alert('Invitation sent!');
    } catch (error) {
      console.error('Error inviting collaborator:', error);
    }
  };

  return (
    <div>
      <h2>Collaborators</h2>
      <input
        type="email"
        placeholder="Enter invitee's email"
        value={inviteeEmail}
        onChange={(e) => setInviteeEmail(e.target.value)}
      />
      <button onClick={handleInvite}>Invite</button>
    </div>
  );
};

export default Collaborators;
