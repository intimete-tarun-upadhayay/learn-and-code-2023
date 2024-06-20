import express from 'express';
import http from 'http';
import { Message } from '../common/common';
import { Server } from 'socket.io';

const PORT = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const connectedClients: { [socketId: string]: string } = {}; // Map socket ID to client name


io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('message', (message: Message) => {
    message.sender = connectedClients[socket.id]; // Add sender name
    console.log(`Message from ${message.sender}: ${message.content}`);
    io.emit('message', message); // Broadcast message to all clients
  });

  socket.on('start',() => {
    console.log(`1. Sign Up 
                 2. Login
                 3. Exit`);
  });

  socket.on('register', (name: string) => {
    connectedClients[socket.id] = name;
    console.log(`Client registered: ${name}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log('Welcome to Recommendation Engine');
});
