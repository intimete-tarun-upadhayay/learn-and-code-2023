import { Socket } from "socket.io";
import AuthController from "../controllers/authentication";

const Auth = new AuthController();

export default class AuthenticationEventHandler{
    private socket;

    constructor(socket:Socket){
        this.socket = socket;
    }

    public authentication = () => {
        this.socket.on('login',(response) => {
            Auth.login(this.socket,response);
        });
    }
}