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

}
