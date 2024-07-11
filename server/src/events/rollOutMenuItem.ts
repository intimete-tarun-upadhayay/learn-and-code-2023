import { Socket } from "socket.io";
import DailyRolloutSocketHandler from "../controllers/rollOutMenuItem";

const dailyRolloutSocketHandler = new DailyRolloutSocketHandler();

export default class DailyRolloutEventHandler {
    socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public listen() {
        this.socket.on("createDailyRollout", async (data) => {
            console.log("data",data);
            
            await dailyRolloutSocketHandler.createDailyRollout(this.socket, data);
        });
        this.socket.on("getDailyRollouts", async () => {
            await dailyRolloutSocketHandler.getDailyRollouts(this.socket);
        });
        this.socket.on("getDailyRolloutById", async (data) => {
            await dailyRolloutSocketHandler.getDailyRolloutById(this.socket, data);
        });
        this.socket.on("getDailyRolloutByDateAndId", async (data) => {
            await dailyRolloutSocketHandler.getDailyRolloutByDateAndId(this.socket, data);
        });
        this.socket.on("updateDailyRollout", async (data) => {
            await dailyRolloutSocketHandler.updateDailyRollout(this.socket, data);
        });
        this.socket.on("deleteDailyRollout", async (data) => {
            await dailyRolloutSocketHandler.deleteDailyRollout(this.socket, data);
        });
    }
}
