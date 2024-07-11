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

  public getRollOutMenuItemsByDateAndId = async (id:string,date:any,username:string) => {
    const query = `SELECT 
    rom.foodItemId,
    rom.itemName,
    rom.price,
    rom.availabilityStatus,
    rom.AveregeSentimentScore,
    rom.AveregeRating,
    rom.recommendation
FROM 
    rollOutMenu rom
JOIN 
    FoodItem fi ON rom.foodItemId = fi.foodItemId
JOIN 
    user_preference up ON up.user_id = '${username}'
WHERE 
    rom.foodItemTypeId = '${id}'
    AND CURDATE() = '${date}'  
ORDER BY 
    CASE WHEN fi.dietary_preference = up.isvegetarian THEN 0 ELSE 1 END,
    CASE WHEN fi.state_preference = up.state_preference THEN 0 ELSE 1 END,
    CASE WHEN fi.spice_level = up.spice_level THEN 0 ELSE 1 END,
    CASE WHEN fi.is_sweet = up.like_sweet THEN 0 ELSE 1 END;
`;
    const connect = await pool.getConnection();
    const result = await pool.query(query);
    (await connect).release();
    return result;
  };
}
