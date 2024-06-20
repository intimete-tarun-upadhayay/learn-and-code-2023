import io from 'socket.io-client';
import promptSync from 'prompt-sync';
import { Message } from '../common/common';

const prompt = promptSync();
const socket = io('http://localhost:8080');

const sendMessage = (message: string) => {
  socket.emit('message', { content: message });
};

socket.on('message', (message: Message) => {
  console.log(`Message from ${message.sender || 'Server'}: ${message.content}`);
});

// socket.on('client-disconnected', (name?: string) => {
//   console.log(`${name ? name : 'A client'} disconnected`);
// });

const name = prompt("Enter your name : ");
socket.emit('register', name);

// Example usage
sendMessage('Hello from client!');
