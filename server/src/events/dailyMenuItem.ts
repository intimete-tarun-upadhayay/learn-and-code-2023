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
        this.socket.on("getDailyMenuItems", async (data) => {
            await dailyMenuItemController.getDailyMenuItems(this.socket,data);
        });
        this.socket.on("getDailyMenuItemByFoodTypeId", async (data) => {
            await dailyMenuItemController.getDailyMenuItemByFoodTypeId(this.socket, data);
        });
        this.socket.on("deleteDailyMenuItem", async (data) => {
            await dailyMenuItemController.deleteDailyMenuItem(this.socket, data);
        });
    }
}

