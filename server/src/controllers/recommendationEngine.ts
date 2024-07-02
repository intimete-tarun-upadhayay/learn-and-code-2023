import { Socket } from "socket.io";
import RecommendationEngineServices from "../services/recommendationEngine";

export default class RecommendationEngineController {
  private recommendationEngineService: RecommendationEngineServices;

  constructor() {
    this.recommendationEngineService = new RecommendationEngineServices();
  }

  public recommendationEngine = async (socket: Socket, FoodItemCategory: any) => {
    const menuItem = this.recommendationEngineService.recommendationEngine(FoodItemCategory);
    try {
      socket.emit('getRecommendedItemsSuccess', menuItem);
    } catch (error) {
      socket.emit('getRecommendedItemsError', { error: error.message });
    }
  };

}
