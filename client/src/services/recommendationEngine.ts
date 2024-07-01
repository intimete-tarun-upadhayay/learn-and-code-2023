import {Socket } from "socket.io-client";

class RecommendationEngineServices {
    private socket:Socket

    constructor(io:Socket) {
        this.socket = io;
    }

    public async login(username:string,password:string):Promise<any> {
        return new Promise((resolve, reject) => {
            this.socket.emit('login', { username, password })

            this.socket.on('authSuccess', (data) => {
                resolve(data.userId);
            })
            this.socket.on('authError', (error) => {
                console.log("LOgin Failed");
                reject(error);
            })
        });
    }
}

export default RecommendationEngineServices;