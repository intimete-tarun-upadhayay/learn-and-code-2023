import { Socket } from "socket.io";
import RecommendationEngineServices from "../services/recommendationEngine";

export default class RecommendationEngineController {
  private recommendationEngineService: RecommendationEngineServices;

  constructor() {
    this.recommendationEngineService = new RecommendationEngineServices();
  }

  public recommendationEngine = async (socket: Socket, data:any) => {
    const { FoodItemCategory } = data;
    const menuItem = await this.recommendationEngineService.getRecommendations(FoodItemCategory);    
    try {
      socket.emit('getRecommendedItemsSuccess', menuItem);
    } catch (error) {
      socket.emit('getRecommendedItemsError', { error: error.message });
    }
  };

  public discardedMenuItem = async (socket: Socket, data:any) => {
    const { FoodItemCategory } = data;
    const menuItem = await this.recommendationEngineService.getDiscardableItems(FoodItemCategory);    
    try {
      socket.emit('getDiscardedMenuItemsSuccess', menuItem);
    } catch (error) {
      socket.emit('getDiscardedMenuItemsError', { error: error.message });
    }
  };

  public addDiscardedMenuItem = async (socket: Socket, data:any) => {
    console.log("data",data);
    
    const { id,name,category,price,availability_status,avg_sentiment_score,avg_rating } = data;
    await this.recommendationEngineService.addDiscardableItems(id,name,category,price,availability_status,avg_sentiment_score,avg_rating );    
    try {
      socket.emit('addDiscardedMenuItemsSuccess', "Discarded Menu Item is added.");
    } catch (error) {
      socket.emit('addDiscardedMenuItemsError', { error: error.message });
    }
  };

}
