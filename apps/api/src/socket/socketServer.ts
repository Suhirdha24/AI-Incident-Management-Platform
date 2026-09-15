import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../logger';

let io: SocketIOServer | null = null;

export function initSocketServer(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket client connected: ${socket.id}`);

    socket.on('join_incident', (incidentId: string) => {
      socket.join(`incident_${incidentId}`);
      logger.info(`Socket ${socket.id} joined room incident_${incidentId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function broadcastEvent(eventName: string, data: any, roomId?: string) {
  if (!io) return;
  if (roomId) {
    io.to(roomId).emit(eventName, data);
  } else {
    io.emit(eventName, data);
  }
}
