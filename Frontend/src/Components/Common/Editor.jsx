import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const Editor = () => {
  const { documentId } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    socket.emit('join-room', { roomId: documentId, userId: 'currentUserId' });

    socket.on('content-updated', (newContent) => {
      setContent(newContent);
    });

    return () => socket.disconnect();
  }, [documentId]);

  const handleContentChange = (e) => {
    const updatedContent = e.target.value;
    setContent(updatedContent);
    socket.emit('update-content', { roomId: documentId, content: updatedContent });
  };

  return (
    <textarea
      value={content}
      onChange={handleContentChange}
      rows="20"
      cols="80"
      placeholder="Start writing..."
    />
  );
};

export default Editor;
