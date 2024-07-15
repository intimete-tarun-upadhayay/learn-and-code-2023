import io from 'socket.io-client';
import promptSync from 'prompt-sync';
import AuthServices from './src/services/authentication';
import RoleOperation from './src/common/handleRole';

const prompt = promptSync();
const socket = io('http://localhost:8080');
const AuthService = new AuthServices(socket);
const RoleOperator = new RoleOperation(socket);

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
      RoleOperator.handleUserRole(username,roleId,socket);
    }
    else
    {
      throw new Error('Authentication failed. Please check your employee ID and name.');
    }
  } catch (error) {
    
  }
};

main();

