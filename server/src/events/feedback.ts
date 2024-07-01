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
            console.log("Working");
            
            const addItem = feedbackController.createFeedback(this.socket,newFeedback);
        });
        
        this.socket.on('updateFeedback',async(updateFeedbackItem) => {
            const updateItem = feedbackController.updateFeedback(this.socket,updateFeedbackItem);
        })

        this.socket.on('deleteFeedback',async(deleteItemId) => {
            const updateItem = feedbackController.deleteFeedback(this.socket,deleteItemId);
        })
        
        this.socket.on('getFeedbacks', async() => {
            const feedbacks = feedbackController.getFeedbacks(this.socket);
        })

        this.socket.on('getFeedbackById', async(feedbackId:any) => {
            const feedbacks = feedbackController.getFeedbackById(this.socket,feedbackId);
        })
    }
}