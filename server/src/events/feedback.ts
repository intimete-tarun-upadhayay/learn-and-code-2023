import { Socket } from "socket.io";
import FeedbackController from "../controllers/feedback";

const feedbackController = new FeedbackController();

export default class FeedbackEventHandler{
    private socket;

    constructor(socket:Socket){
        this.socket = socket;
    }

    public listen(){
        this.socket.on('createFeedback', async (newFeedback) => {
            const sendFeedback = feedbackController.createFeedback(this.socket,newFeedback);
        });
        
        this.socket.on('updateFeedback',async(feedbackId,) => {
            const updateFeedback = feedbackController.updateFeedback(this.socket,feedbackId);
        })

        this.socket.on('deleteFeedback',async(feedbackData) => {
            const deleteFeedback = feedbackController.deleteFeedback(this.socket,feedbackData);
        })
        
        this.socket.on('getFeedbacks', async() => {
            const getFeedbacks = feedbackController.getFeedbacks(this.socket);
        })

        this.socket.on('getFeedbackById', async(feedbackId:any) => {
            const getfeedback = feedbackController.getFeedbackById(this.socket,feedbackId);
        })
        this.socket.on('getFeedbackByCategoryId', async(CategoryItemType:any) => {
            const getfeedback = feedbackController.getFeedbackByCategoryId(this.socket,CategoryItemType);
        })
    }
}