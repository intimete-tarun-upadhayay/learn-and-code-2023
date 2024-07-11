import pool from '../../src/config/connection';

class DailyMenuItemsService {
    async createDailyMenuItem(menuId:number, foodItemTypeId:number) {
        try {
            const connect = pool.getConnection();
            const data = await pool.query(`insert into UserFoodChoose (foodItemId,foodItemTypeId) values('${menuId}','${foodItemTypeId}')`);
            (await connect).release();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyMenuItems() {
        try {
            // const dailyMenuItems = await DailyMenuItems.findAll();
            // return dailyMenuItems;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyMenuItemById(id: number) {
        try {
            // const dailyMenuItem = await DailyMenuItems.findByPk(id);
            // if (!dailyMenuItem) {
            //     throw new Error("Daily menu item not found");
            // }
            // return dailyMenuItem;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateDailyMenuItem(id: number, menu_id: number, item_id: number, quantity_prepared: number) {
        try {
            // const dailyMenuItem = await DailyMenuItems.findByPk(id);
            // if (!dailyMenuItem) {
            //     throw new Error("Daily menu item not found");
            // }
            // dailyMenuItem.menu_id = menu_id;
            // dailyMenuItem.item_id = item_id;
            // dailyMenuItem.quantity_prepared = quantity_prepared;
            // await dailyMenuItem.save();
            // return dailyMenuItem;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteDailyMenuItem(id: number) {
        try {
            // const dailyMenuItem = await DailyMenuItems.findByPk(id);
            // if (!dailyMenuItem) {
            //     throw new Error("Daily menu item not found");
            // }
            // await dailyMenuItem.destroy();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default DailyMenuItemsService;
