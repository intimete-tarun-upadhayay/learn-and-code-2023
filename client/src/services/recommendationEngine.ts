import { Socket } from "socket.io-client";

class RecommendationEngineServices {
  private socket: Socket;

  constructor(io: Socket) {
    this.socket = io;
  }

  public async recommendationEngine(
    FoodItemCategory: any,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit("getRecommendedItems", {
        FoodItemCategory,
      });

      this.socket.on("getRecommendedItemsSuccess", (data) => {
        resolve(data);
      });
      this.socket.on("getRecommendedItemsError", (error) => {
        reject(
          new Error(error.message || "Failed to fetch recommended menu items")
        );
      });
    });
  }

  public async getdiscardedMenuItems(FoodItemCategory: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit("getDiscardedMenuItems", { FoodItemCategory });

      this.socket.on("getDiscardedMenuItemsSuccess", (data) => {
        resolve(data);
      });
      this.socket.on("getDiscardedMenuItemsError", (error) => {
        reject(
          new Error(error.message || "Failed to fetch recommended menu items")
        );
      });
    });
  }

  public async addDiscardedMenuItem(foodItemData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit("addDiscardedMenuItems", foodItemData);

      this.socket.on("addDiscardedMenuItemsSuccess", (data) => {
        resolve(data);
      });
      this.socket.on("addDiscardedMenuItemsError", (error) => {
        reject(
          new Error(error.message || "Failed to fetch recommended menu items")
        );
      });
    });
  }

}

export default RecommendationEngineServices;
