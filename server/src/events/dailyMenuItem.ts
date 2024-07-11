import { Socket } from "socket.io";
import DailyMenuController from "../controllers/dailyMenuItem";

const dailyMenuItemController = new DailyMenuController();

export default class DailyMenuItemEventHandler {
    socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    listen(){
        this.socket.on("createDailyMenuItem", async (data) => {
            await dailyMenuItemController.createDailyMenuItem(this.socket, data);
        });
        this.socket.on("getDailyMenuItems", async () => {
            await dailyMenuItemController.getDailyMenuItems(this.socket);
        });
        this.socket.on("getDailyMenuItemById", async (data) => {
            await dailyMenuItemController.getDailyMenuItemById(this.socket, data);
        });
        this.socket.on("updateDailyMenuItem", async (data) => {
            await dailyMenuItemController.updateDailyMenuItem(this.socket, data);
        });
        this.socket.on("deleteDailyMenuItem", async (data) => {
            await dailyMenuItemController.deleteDailyMenuItem(this.socket, data);
        });
    }
}

