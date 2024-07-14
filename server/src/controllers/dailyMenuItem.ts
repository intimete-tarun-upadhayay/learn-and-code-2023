import { Socket } from 'socket.io';
import DailyMenuItemService from '../services/dailyMenuItem';

class DailyMenuItemController {
    private dailyMenuItemService: DailyMenuItemService;

    constructor() {
        this.dailyMenuItemService = new DailyMenuItemService();
    }

    public createDailyMenuItem = async (socket: Socket, data: any): Promise<void> => {
        const { menuId, foodItemTypeId,username } = data;
        try{
            await this.dailyMenuItemService.createDailyMenuItem(menuId, foodItemTypeId,username);
            socket.emit('createDailyMenuItemSuccess', "Daily menu item created successfully");
        } catch (error) {
            socket.emit('createDailyMenuItemError', { error: error.message });
        }
    };

    public getDailyMenuItems = async (socket: Socket): Promise<void> => {
        try {
            const dailyMenuItems = await this.dailyMenuItemService.getDailyMenuItems();
            socket.emit('getDailyMenuItemsSuccess', dailyMenuItems);
        } catch (error) {
            socket.emit('getDailyMenuItemsError', { error: error.message });
        }
    };

    public getDailyMenuItemById = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            const dailyMenuItem = await this.dailyMenuItemService.getDailyMenuItemById(+id);
            socket.emit('getDailyMenuItemByIdSuccess', dailyMenuItem);
        } catch (error) {
            socket.emit('getDailyMenuItemByIdError', { error: error.message });
        }
    };

    public updateDailyMenuItem = async (socket: Socket, data: any): Promise<void> => {
        const { id, menu_id, item_id, quantity_prepared } = data;
        try {
            const dailyMenuItem = await this.dailyMenuItemService.updateDailyMenuItem(+id, menu_id, item_id, quantity_prepared);
            socket.emit('updateDailyMenuItemSuccess', dailyMenuItem);
        } catch (error) {
            socket.emit('updateDailyMenuItemError', { error: error.message });
        }
    };

    public deleteDailyMenuItem = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.dailyMenuItemService.deleteDailyMenuItem(+id);
            socket.emit('deleteDailyMenuItemSuccess');
        } catch (error) {
            socket.emit('deleteDailyMenuItemError', { error: error.message });
        }
    };
}

export default DailyMenuItemController;
