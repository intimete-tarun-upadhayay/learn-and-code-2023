type UserRole = 'admin' | 'chef' | 'employee';
import { Socket } from 'socket.io-client';
import handleAdminMenuAction from '../commands/adminMenu';
import handleChefMenuAction from '../commands/chefMenu';
import handleEmpMenuAction from '../commands/employeeMenu';

class RoleOperation {
    private socket:Socket;
    
    constructor(io:Socket){
        this.socket = io;
    }
    
    // chefMenu = new ChefAdminMenu(this.socket);
    public handleUserRole(role: UserRole,io:Socket): void {
    
        switch (role) {
            case 'admin':
                console.log(`------------------------------`);
                console.log('Successfully Login : Admin');
                console.log(`------------------------------`);
                handleAdminMenuAction(this.socket);
                break;
            case 'chef':
                // Code to handle chef role
                console.log(`------------------------------`);
                console.log('Successfully Login : Chef');
                console.log(`------------------------------`);
                handleChefMenuAction(this.socket);
                break;
            case 'employee':
                // Code to handle employee role
                console.log(`------------------------------`);
                console.log('Successfully Login : Employee');
                console.log(`------------------------------`);
                handleEmpMenuAction(this.socket);
                break;
            default:
                // This case is not necessary since `role` is restricted to 'admin' | 'chef' | 'employee'
                // But you can add an error handling case if you want
                console.log('Access denied: Unknown role');
                break;
        }
    }
}


export default RoleOperation;