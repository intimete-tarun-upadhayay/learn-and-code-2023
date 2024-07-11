import { Socket } from "socket.io-client";
import { RollOutMenuItem } from '../types/rollOutMenuItem'; 

class RollOutMenuItemService {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    public async createDailyRollout(menuItem: RollOutMenuItem): Promise<RollOutMenuItem> {
        return new Promise((resolve, reject) => {
            this.socket.emit('createDailyRollout', menuItem);

            this.socket.on('createDailyRolloutSuccess', (data: RollOutMenuItem) => {
                resolve(data);
            });

            this.socket.on('createDailyRolloutError', (error: any) => {
                reject(new Error(error.message || 'Failed to create daily menu item'));
            });
        });
    }

    public async getDailyRollouts(): Promise<RollOutMenuItem[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getDailyRollouts');

            this.socket.on('getDailyRolloutsSuccess', (data: RollOutMenuItem[]) => {
                resolve(data);
            });

            this.socket.on('getDailyRolloutsError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch daily menu items'));
            });
        });
    }

    public async getDailyRolloutById(id: number): Promise<RollOutMenuItem> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getDailyRolloutById', { id });

            this.socket.on('getDailyRolloutByIdSuccess', (data: RollOutMenuItem) => {
                resolve(data);
            });

            this.socket.on('getDailyRolloutByIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch daily menu item'));
            });
        });
    }

    public async getDailyRolloutByDateAndCategoryId(id: number,date:any): Promise<RollOutMenuItem> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getDailyRolloutByDateAndId', { id,date });

            this.socket.on('getDailyRolloutByDateAndIdSuccess', (data: RollOutMenuItem) => {
                resolve(data);
            });

            this.socket.on('getDailyRolloutByDateAndIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch daily menu item'));
            });
        });
    }

    public async updateDailyRollout(id: number, menuItem: RollOutMenuItem): Promise<RollOutMenuItem> {
        return new Promise((resolve, reject) => {
            this.socket.emit('updateDailyRollout', { ...menuItem, id });

            this.socket.on('updateDailyRolloutSuccess', (data: RollOutMenuItem) => {
                resolve(data);
            });

            this.socket.on('updateDailyRolloutError', (error: any) => {
                reject(new Error(error.message || 'Failed to update daily menu item'));
            });
        });
    }

    public async deleteDailyMenuItem(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.emit('deleteDailyRollout', { id });

            this.socket.on('deleteDailyRolloutSuccess', () => {
                resolve();
            });

            this.socket.on('deleteDailyRolloutError', (error: any) => {
                reject(new Error(error.message || 'Failed to delete daily menu item'));
            });
        });
    }
}

export default RollOutMenuItemService;
