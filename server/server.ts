import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import pool from './src/config/connection';
import AuthenticationEventHandler from './src/events/authentication';
import MenuItemEventHandler from './src/events/menuItem';
import FeedbackEventHandler from './src/events/feedback';
import RecommendationEngineEventHandler from './src/events/recommendationEngine';
import DailyRolloutEventHandler from './src/events/rollOutMenuItem';
import DailyMenuItemEventHandler from './src/events/dailyMenuItem';

const PORT = 8080;
const app:Application = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {

  const authEventHandler = new AuthenticationEventHandler(socket);
  authEventHandler.authentication();

  const adminEventHandler = new MenuItemEventHandler(socket);
  adminEventHandler.listen();

  const feedbackEventHandler = new FeedbackEventHandler(socket);
  feedbackEventHandler.listen();

  const RecommendationEventHandler = new RecommendationEngineEventHandler(socket);
  RecommendationEventHandler.listen();

  const RollOutMenuItemEventHandler = new DailyRolloutEventHandler(socket);
  RollOutMenuItemEventHandler.listen();

  const dailyMenuItemEventHandler = new DailyMenuItemEventHandler(socket);
  dailyMenuItemEventHandler.listen();
});



server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
