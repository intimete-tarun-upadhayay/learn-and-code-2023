import pool from "../../src/config/connection";

export default class RollOutMenuItemServices {
  public createRollOutMenuItem = async (rollOutFoodItem: any) => {
    const values = rollOutFoodItem
      .map(
        (item: any) =>
          `('${item.id}','${item.name}','${item.category}','${item.price}','${item.availability_status}','${item.avg_sentiment_score}','${item.avg_rating}','${item.recommendation}')`
      )
      .join(",");

    const query = `INSERT INTO rollOutMenu (foodItemId, itemName, foodItemTypeId, price, availabilityStatus, AveregeSentimentScore, AveregeRating, recommendation) VALUES ${values}`;

    const connect = await pool.getConnection();
    await pool.query(query);
    // const data = await pool.query(`insert into rollOutMenu (foodItemId,itemName,foodItemTypeId,price,availabilityStatus,AveregeSentimentScore,AveregeRating,recommendation) values('${rollOutFoodItem.id}','${rollOutFoodItem.name}','${rollOutFoodItem.category}','${rollOutFoodItem.price}','${rollOutFoodItem.availability_status}','${rollOutFoodItem.avg_sentiment_score}','${rollOutFoodItem.avg_rating}','${rollOutFoodItem.recommendation}')`);
    (await connect).release();
  };

  public getRollOutMenuItemsByDateAndId = async (id,date) => {
    console.log(date);
    
    const query = `SELECT * FROM rollOutMenu WHERE foodItemTypeId = '${id}' AND DATE(currentDate) = '${date}'`;
    const connect = await pool.getConnection();
    const result = await pool.query(query);
    (await connect).release();
    return result;
  };
}
