type UserRole = 'admin' | 'chef' | 'employee';
import { Socket } from 'socket.io-client';
import handleAdminMenuAction from '../commands/adminMenu'; 

function handleUserRole(role: UserRole,io:Socket): void {
    switch (role) {
        case 'admin':
            handleAdminMenuAction(io);
            break;
        case 'chef':
            // Code to handle chef role
            console.log('Access granted: Chef');
            break;
        case 'employee':
            // Code to handle employee role
            console.log('Access granted: Employee');
            break;
        default:
            // This case is not necessary since `role` is restricted to 'admin' | 'chef' | 'employee'
            // But you can add an error handling case if you want
            console.log('Access denied: Unknown role');
            break;
    }
}

export default handleUserRole;