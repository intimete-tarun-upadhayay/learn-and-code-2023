import { Socket } from 'socket.io';
import DailyItemService from '../services/dailyMenu';

class DailyItemController {
    private dailyItemService: DailyItemService;
    public createDailyItem = async (socket: Socket, data: any): Promise<void> => {
        const { menu_type, date } = data;
        console.log('createDailyItem', menu_type, date);
        try {
            const dailyItemSubmission = await this.dailyItemService.createDailyMenuItem();
            socket.emit('createDailyItemSuccess', dailyItemSubmission);
        } catch (error) {
            socket.emit('createDailyItemError', { error: error.message });
        }
    };
    public deleteDailyItem = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.dailyItemService.deleteDailyMenuItem(id);
            socket.emit('deleteDailyItemSuccess');
        } catch (error) {
            socket.emit('deleteDailyItemError', { error: error.message });
        }
    };
    public getDailyItemByDate = async (socket: Socket, data: any): Promise<void> => {
        const { date } = data;
        try {
            const dailyItem = await this.dailyItemService.getDailyMenuItemByDate(date);
            socket.emit('getDailyItemByDateSuccess', dailyItem);
        } catch (error) {
            socket.emit('getDailyItemByDateError', { error: error.message });
        }
    };
    public getDailyItemById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const dailyItem = await this.dailyItemService.getDailyMenuItemById(id);
            socket.emit('getDailyItemByIdSuccess', dailyItem);
        } catch (error) {
            socket.emit('getDailyItemByIdError', { error: error.message });
        }
    };
    public getDailyItems = async (socket: Socket): Promise<void> => {
        try {
            const dailyItem = await this.dailyItemService.getDailyMenuItems();
            socket.emit('getDailyItemsSuccess', dailyItem);
        } catch (error) {
            socket.emit('getDailyItemsError', { error: error.message });
        }
    };
    public updateDailyItem = async (socket: Socket, data: any): Promise<void> => {
        const { menu_type, date } = data;
        try {
            const dailyItemSubmission = await this.dailyItemService.updateDailyMenuItem(menu_type, date,1,2);
            socket.emit('updateDailyItemSubmissionSuccess', dailyItemSubmission);
        } catch (error) {
            socket.emit('updateDailyItemSubmissionError', { error: error.message });
        }
    };

    constructor() {
        this.dailyItemService = new DailyItemService();
    }
}

export default DailyItemController;
