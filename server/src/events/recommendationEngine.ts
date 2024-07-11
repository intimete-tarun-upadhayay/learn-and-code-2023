import { Socket } from "socket.io";
import RecommendationEngineController from "../controllers/recommendationEngine";

const recommendationEngine = new RecommendationEngineController();


export default class RecommendationEngineEventHandler {
    private socket;

    constructor(socket:Socket)
    {
        this.socket = socket;
    }

    public listen(){
        this.socket.on('getRecommendedItems', async (data) => {
            const recommendatedMenuItem = recommendationEngine.recommendationEngine(this.socket,data);
        });
        
    }
}