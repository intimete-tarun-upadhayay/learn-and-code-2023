import { Socket } from "socket.io";
import authenticationService from "../services/authenticationServices";
import { error } from "console";

class AuthController {
    private authServices:authenticationService

    constructor() {
        this.authServices = new authenticationService();
    }

    public login = async (socket:Socket, response) => {
        const {username, password} = response;
        console.log("Login Atttempt : ", username, password);
        
        try {
            const userId = await this.authServices.userLogin(username,password);
            if(!userId)
            {
                socket.emit('authError',{error:"Invalid Credentials"});
            }
            // console.log(user[0].role_id);
            
            console.log('Login Successful');
            socket.emit('authSuccess',{mesage:'Login Successful',userId});
        } catch (error) {
            socket.emit('authError',{error:"Invalid Credentials"});
        }
    }
}

export default AuthController;