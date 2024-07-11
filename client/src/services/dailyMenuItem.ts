import { Socket } from "socket.io-client";
import { DailyMenu } from '../types/dailyMenu'; 

class DailyMenuItemService {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public async createDailyMenuItem(menuItem: any): Promise<String> {
        return new Promise((resolve, reject) => {
            this.socket.emit('createDailyMenuItem', menuItem);

            this.socket.on('createDailyMenuItemSuccess', (data: string) => {
                resolve(data);
            });

            this.socket.on('createDailyMenuItemError', (error: any) => {
                reject(new Error(error.message || 'Failed to create daily menu item'));
            });
        });
    }

    public async getDailyMenuItems(): Promise<DailyMenu[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getDailyMenuItems');

            this.socket.on('getDailyMenuItemsSuccess', (data: DailyMenu[]) => {
                resolve(data);
            });

            this.socket.on('getDailyMenuItemsError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch daily menu items'));
            });
        });
    }

    public async getDailyMenuItemById(id: number): Promise<DailyMenu> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getDailyMenuItemById', { id });

            this.socket.on('getDailyMenuItemByIdSuccess', (data: DailyMenu) => {
                resolve(data);
            });

            this.socket.on('getDailyMenuItemByIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch daily menu item'));
            });
        });
    }

    public async updateDailyMenuItem(id: number, menuItem: DailyMenu): Promise<DailyMenu> {
        return new Promise((resolve, reject) => {
            this.socket.emit('updateDailyMenuItem', { ...menuItem, id });

            this.socket.on('updateDailyMenuItemSuccess', (data: DailyMenu) => {
                resolve(data);
            });

            this.socket.on('updateDailyMenuItemError', (error: any) => {
                reject(new Error(error.message || 'Failed to update daily menu item'));
            });
        });
    }

    public async deleteDailyMenuItem(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.emit('deleteDailyMenuItem', { id });

            this.socket.on('deleteDailyMenuItemSuccess', () => {
                resolve();
            });

            this.socket.on('deleteDailyMenuItemError', (error: any) => {
                reject(new Error(error.message || 'Failed to delete daily menu item'));
            });
        });
    }
}

export default DailyMenuItemService;
