import { Socket } from "socket.io";
import DailyItemController from "../controllers/dailyMenu";

const dailyItemController = new DailyItemController();

export default class DailyItemEventHandler {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    listen() {
        this.socket.on("createDailyItem", async (data) => {
            await dailyItemController.createDailyItem(this.socket, data);
        });
        this.socket.on("getDailyItem", async () => {
            await dailyItemController.getDailyItems(this.socket);
        });
        this.socket.on("getDailyItemById", async (data) => {
            await dailyItemController.getDailyItemById(this.socket, data);
        });
        this.socket.on("getDailyItemByDate", async (data) => {
            await dailyItemController.getDailyItemByDate(this.socket, data);
        });
        this.socket.on("updateDailyItem", async (data) => {
            await dailyItemController.updateDailyItem(this.socket, data);
        });
        this.socket.on("deleteDailyItem", async (data) => {
            await dailyItemController.deleteDailyItem(this.socket, data);
        });
    }
}
