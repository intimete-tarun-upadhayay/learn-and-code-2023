import pool from '../../src/config/connection';

class DailyMenuItemsService {
    async createDailyMenuItem(menuId:number, foodItemTypeId:number,userId: string) {
        try {
            const connect = pool.getConnection();
            const data = await pool.query(`insert into UserFoodChoose (userId,foodItemId,foodItemTypeId) values('${userId}','${menuId}','${foodItemTypeId}')`);
            (await connect).release();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyMenuItems(userId: string) {
        try {
            const connect = pool.getConnection();
            const data = await pool.query(`SELECT * FROM UserFoodChoose WHERE DATE(currentDate) = CURDATE() AND userId = '${userId}'`);
            return data;
            (await connect).release();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getDailyMenuItemByFoodTypeId(foodItemTypeId: number,userId: string) {
        try {
            const connect = pool.getConnection();
            const data = await pool.query(`SELECT * FROM UserFoodChoose WHERE foodItemTypeId = ${foodItemTypeId} AND DATE(currentDate) = curdate() AND userId = '${userId}'`);            
            return data;
            (await connect).release();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteDailyMenuItem(foodItemTypeId: number,userId: string) {
        try {
            const connect = pool.getConnection();
            const data = await pool.query(`SELECT * FROM UserFoodChoose WHERE foodItemTypeId = ${foodItemTypeId} AND DATE(currentDate) = CURDATE() AND userId = '${userId}'`);
            (await connect).release();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default DailyMenuItemsService;
