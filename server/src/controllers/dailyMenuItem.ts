import { Socket } from 'socket.io';
import DailyMenuItemService from '../services/dailyMenuItem';

class DailyMenuItemController {
    private dailyMenuItemService: DailyMenuItemService;

    constructor() {
        this.dailyMenuItemService = new DailyMenuItemService();
    }

    public createDailyMenuItem = async (socket: Socket, data: any): Promise<void> => {
        const { menuId, foodItemTypeId,userId } = data;
        try{
            await this.dailyMenuItemService.createDailyMenuItem(menuId, foodItemTypeId,userId);
            socket.emit('createDailyMenuItemSuccess', "Daily menu item created successfully");
        } catch (error) {
            socket.emit('createDailyMenuItemError', { error: error.message });
        }
    };

    public getDailyMenuItems = async (socket: Socket,data): Promise<void> => {
        const {userId} = data;
        try {
            const dailyMenuItems = await this.dailyMenuItemService.getDailyMenuItems(userId);
            socket.emit('getDailyMenuItemsSuccess', dailyMenuItems);
        } catch (error) {
            socket.emit('getDailyMenuItemsError', { error: error.message });
        }
    };

    public getDailyMenuItemByFoodTypeId = async (socket: Socket, data: any): Promise<void> => {
        const { foodItemTypeId,userId } = data;
        try {
            const dailyMenuItem = await this.dailyMenuItemService.getDailyMenuItemByFoodTypeId(+foodItemTypeId,userId);
            socket.emit('getDailyMenuItemByFoodTypeIdSuccess', dailyMenuItem);
        } catch (error) {
            socket.emit('getDailyMenuItemByFoodTypeIdError', { error: error.message });
        }
    };

    public deleteDailyMenuItem = async (socket: Socket, data: any): Promise<void> => {
        const { id ,userId} = data;
        try {
            await this.dailyMenuItemService.deleteDailyMenuItem(+id,userId);
            socket.emit('deleteDailyMenuItemSuccess');
        } catch (error) {
            socket.emit('deleteDailyMenuItemError', { error: error.message });
        }
    };
}

export default DailyMenuItemController;
