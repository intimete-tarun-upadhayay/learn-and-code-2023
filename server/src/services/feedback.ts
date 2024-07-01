import pool from '../../src/config/connection';

class FeedbackService {
    public createFeedback = async (userId, foodItemId, rating, comment) => {
        const connect = pool.getConnection();
        const data = await pool.query(`insert into Review (userId,foodItemId,rating,comment) values('${userId}','${foodItemId}','${rating}','${comment}')`);
        (await connect).release();
    }

    public updateFeedback = async (menuItem,id) => {
        const connect = pool.getConnection();
        const updateItem = await pool.query(`update FoodItem set ${menuItem.updatedField} = '${menuItem.updatedValue}' where foodItemId = '${id}'`);
        (await connect).release();
    }

    public deleteFeedback = async (deleteItemId) => {
      const connect = pool.getConnection();
      const deleteItem = await pool.query(`delete from FoodItem where foodItemId = '${deleteItemId.id}'`);
      console.log(deleteItem);
    }

    public getFeedbacks = async () => {
        const connect = pool.getConnection();
        const menuItems = await pool.query(`select itemName, price,availabilityStatus,foodItemTypeId from FoodItem`);
        return menuItems;
    }

    public getFeedbackById = async (feedbackId) => {
        const connect = pool.getConnection();
        const menuItems = await pool.query(`select itemName, price,availabilityStatus,foodItemTypeId from FoodItem`);
        return menuItems;
    }
}

export default FeedbackService;