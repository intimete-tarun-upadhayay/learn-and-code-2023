import { Socket } from "socket.io";
import FeedbackService from "../services/feedback";


class FeedbackController {
    private feedbackService:FeedbackService;

    constructor(){
        this.feedbackService = new FeedbackService();
    }

    public createFeedback = async (socket: Socket, data: any): Promise<void> => {
        const { userId, foodItemId, rating, comment } = data;
        try {
            const feedback = await this.feedbackService.createFeedback(userId, foodItemId, rating, comment);
            socket.emit('createFeedbackSuccess', feedback);
        } catch (error) {
            socket.emit('createFeedbackError', { error: error.message });
        }
    };

    public getFeedbacks = async (socket: Socket): Promise<void> => {
        try {
            const feedbacks = await this.feedbackService.getFeedbacks();
            socket.emit('getFeedbacksSuccess', feedbacks);
        } catch (error) {
            socket.emit('getFeedbacksError', { error: error.message });
        }
    };

    public getFeedbackById = async (socket: Socket, feedbackId: any): Promise<void> => {
        try {
            const feedback = await this.feedbackService.getFeedbackById(+feedbackId);
            socket.emit('getFeedbackByIdSuccess', feedback);
        } catch (error) {
            socket.emit('getFeedbackByIdError', { error: error.message });
        }
    };

    public getFeedbackByCategoryId = async (socket: Socket, CategoryItemType: any): Promise<void> => {
        try {
            const feedback = await this.feedbackService.getFeedbackByCategoryId(CategoryItemType);
            console.log("feedback",feedback);
            socket.emit('getFeedbackByCategoryIdSuccess', feedback);
        } catch (error) {
            socket.emit('getFeedbackByCategoryIdError', { error: error.message });
        }
    };

    public updateFeedback = async (socket: Socket, data: any): Promise<void> => {
        try {
            const feedback = await this.feedbackService.updateFeedback(data);
            socket.emit('updateFeedbackSuccess', feedback);
        } catch (error) {
            socket.emit('updateFeedbackError', { error: error.message });
        }
    };

    public deleteFeedback = async (socket: Socket, data: any): Promise<void> => {
        const { id } = data;
        try {
            await this.feedbackService.deleteFeedback(+id);
            socket.emit('deleteFeedbackSuccess');
        } catch (error) {
            socket.emit('deleteFeedbackError', { error: error.message });
        }
    };
}


export default FeedbackController;