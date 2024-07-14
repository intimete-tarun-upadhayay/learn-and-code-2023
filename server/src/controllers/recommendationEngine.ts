import { Socket } from "socket.io";
import RecommendationEngineServices from "../services/recommendationEngine";

export default class RecommendationEngineController {
  private recommendationEngineService: RecommendationEngineServices;

  constructor() {
    this.recommendationEngineService = new RecommendationEngineServices();
  }

  public recommendationEngine = async (socket: Socket, data:any) => {
    const { FoodItemCategory,discardedItems } = data;
    const menuItem = await this.recommendationEngineService.getRecommendations(FoodItemCategory,discardedItems);    
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
      console.log("server rec -- con");
      socket.emit('getDiscardedMenuItemsSuccess', menuItem);
    } catch (error) {
      socket.emit('getDiscardedMenuItemsError', { error: error.message });
    }
  };

}
