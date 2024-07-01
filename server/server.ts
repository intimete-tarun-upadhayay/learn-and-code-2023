import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import pool from './src/config/connection';
import AuthenticationEventHandler from './src/events/authentication';
import MenuItemEventHandler from './src/events/menuItem';
import FeedbackEventHandler from './src/events/feedback';

const PORT = 8080;
const app:Application = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {

  const authEventHandler = new AuthenticationEventHandler(socket);
  authEventHandler.authentication();

  const adminEventHandler = new MenuItemEventHandler(socket);
  adminEventHandler.listen();

  const EmployeeEventHandler = new FeedbackEventHandler(socket);
  EmployeeEventHandler.listen();
});



server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
