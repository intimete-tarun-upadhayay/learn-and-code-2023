import {Socket } from "socket.io-client";

class RecommendationEngineServices {
    private socket:Socket

    constructor(io:Socket) {
        this.socket = io;
    }

    public async recommendationEngine(FoodItemCategory:any,discardedItems:boolean):Promise<any> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getRecommendedItems', {FoodItemCategory,discardedItems})

            this.socket.on('getRecommendedItemsSuccess', (data) => {           
                resolve(data);
            })
            this.socket.on('getRecommendedItemsError', (error) => {
                reject(new Error(error.message || 'Failed to fetch recommended menu items'));
            })
        });
    }
}

export default RecommendationEngineServices;