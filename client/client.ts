import io from 'socket.io-client';
import promptSync from 'prompt-sync';
import { Message } from '../common/common';
import handleUserRole from './src/comman/handleRole';

const prompt = promptSync();
const socket = io('http://localhost:8080');

const authenticate = (username:string,password:string) => {
  const user = socket.emit('login',{username,password});
};

console.log('Welcome to Recommendation Engine');
console.log(`------------------------------`);
const username = prompt("Enter username: ");
const password = prompt("Enter password: ");
authenticate(username,password);




// const sendMessage = (message: string) => {
//   socket.emit('message', { content: message });
// };

socket.on('loggedin', (role) => {
  handleUserRole(role,socket);
});


// const name = prompt("Enter your name : ");
// socket.emit('register', name);

// Example usage
// sendMessage('Hello from client!');

