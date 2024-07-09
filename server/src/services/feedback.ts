import pool from '../../src/config/connection';

class FeedbackService {
    public createFeedback = async (userId, foodItemId, rating, comment) => {
        const connect = pool.getConnection();
        const data = await pool.query(`insert into Review (userId,foodItemId,rating,comment) values('${userId}','${foodItemId}','${rating}','${comment}')`);
        (await connect).release();
    }

    public updateFeedback = async (FeedbackData) => {
        const connect = pool.getConnection();
        const updateItem = await pool.query(`update Review set ${FeedbackData.updatedField} = '${FeedbackData.updatedValue}' where foodItemId = '${FeedbackData.id}'`);
        (await connect).release();
    }

    public deleteFeedback = async (FeedbackId) => {
      const connect = pool.getConnection();
      const deleteItem = await pool.query(`delete from Review where foodItemId = '${FeedbackId.id}'`);
      (await connect).release();
    }

    public getFeedbacks = async () => {
        const connect = pool.getConnection();
        const feedbacks = await pool.query(`select itemName, price,availabilityStatus,foodItemTypeId from FoodItem`);
        return feedbacks;
    }

    public getFeedbackById = async (feedbackId) => {
        const connect = pool.getConnection();
        const feedbacks = await pool.query(`select * from Review where reviewId = '${feedbackId}'`);
        return feedbacks;
    }

    public getFeedbackByCategoryId = async (CategoryItemType) => {
            const connect = pool.getConnection();
            // console.log(CategoryItemType.CategoryItemType);
            const feedbacks = await pool.query(`SELECT Review.* FROM Review JOIN FoodItem ON Review.foodItemId = FoodItem.foodItemId WHERE FoodItem.foodItemTypeId = '${CategoryItemType.CategoryItemType}';`);
            return feedbacks;
    }

    // public async getFeedbacksByMenuType(menu_type: number) {
    //     try {
    //         const [feedbacks] = await pool.execute(
    //             `SELECT Feedback.* 
    //              FROM Feedback 
    //              JOIN MenuItem ON Feedback.FoodItemId = MenuItem.FoodItemId 
    //              WHERE MenuItem.category = ?`,
    //             [menu_type]
    //         );

    //         if (!feedbacks.length) {
    //             throw new Error("Feedback not found");
    //         }

    //         return feedbacks;
    //     } catch (error: any) {
    //         throw new Error(error.message);
    //     }
    // }
}

export default FeedbackService;