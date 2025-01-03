import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server as SocketIOServer } from 'socket.io';

let server: Server;
let io: SocketIOServer;

async function main() {
  try {
    await mongoose.connect(config.DatabaseURL as string);

    server = app.listen(config.port, () => {
      console.log(`App is listening on port ${config.port}`);
    });

    // Initialize Socket.IO server
    io = new SocketIOServer(server, {
      cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
      },
    });

    const activeRooms: { [key: string]: string[] } = {};

    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Handle joining room
      socket.on('join-room', ({ roomId, userId }) => {
        if (!activeRooms[roomId]) activeRooms[roomId] = [];
        if (!activeRooms[roomId].includes(userId)) {
          activeRooms[roomId].push(userId);
        }
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
      });

      // Handle real-time content updates
      socket.on('update-content', ({ roomId, content }) => {
        socket.to(roomId).emit('content-updated', content);
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  } catch (err) {
    console.error(err);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log('Unhandled rejection detected, shutting down...');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('Uncaught exception detected, shutting down...');
  process.exit(1);
});
