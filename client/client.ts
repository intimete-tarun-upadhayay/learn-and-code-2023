import io from 'socket.io-client';
import promptSync from 'prompt-sync';
import AuthServices from './src/services/authentication';
import RoleOperation from './src/comman/handleRole';

const prompt = promptSync();
const socket = io('http://localhost:8080');
const AuthService = new AuthServices(socket);
const RoleOperator = new RoleOperation(socket);

// const authenticate = (username:string,password:string) => {
//   const user = socket.emit('login',{username,password});
// };

// console.log('Welcome to Recommendation Engine');
// console.log(`------------------------------`);
// const username = prompt("Enter username: ");
// const password = prompt("Enter password: ");
// authenticate(username,password);

const main = async () => {

  console.log('Welcome to Recommendation Engine');
  console.log(`------------------------------`);
  const username = prompt("Enter username: ");
  const password = prompt("Enter password: ");

  try {
    const roleId = await AuthService.login(username,password);
    console.log(roleId);
    
    if(roleId)
    {
      RoleOperator.handleUserRole(roleId,socket);
    }
    else
    {
      throw new Error('Authentication failed. Please check your employee ID and name.');
    }
  } catch (error) {
    
  }
};


// const sendMessage = (message: string) => {
//   socket.emit('message', { content: message });
// };

// socket.on('loggedin', (role) => {
//   console.log(role);
  
//   handleUserRole(role.userId,socket);
// });


// const name = prompt("Enter your name : ");
// socket.emit('register', name);

// Example usage
// sendMessage('Hello from client!');
main();

