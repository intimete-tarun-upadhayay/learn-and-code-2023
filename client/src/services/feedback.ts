import { Socket } from "socket.io-client";
import { Feedback } from "../types/feedback";

class FeedbackService {
    private socket:Socket;

    constructor(socket:Socket)
    {
        this.socket = socket;
    }

    public async createFeedback(newFeedback): Promise<Feedback> {
        return new Promise((resolve, reject) => {
            
            this.socket.emit('createFeedback', newFeedback);

            this.socket.on('createFeedbackSuccess', (data: Feedback) => {
                resolve(data);
            });

            this.socket.on('createFeedbackError', (error: any) => {
                reject(new Error(error.message || 'Failed to create feedback'));
            });
        });
    }

    public async getFeedbacks(): Promise<Feedback[]> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getFeedbacks');

            this.socket.on('getFeedbacksSuccess', (data: Feedback[]) => {
                resolve(data);
            });

            this.socket.on('getFeedbacksError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch feedbacks'));
            });
        });
    }

    public async getFeedbackById(feedbackId: number): Promise<Feedback> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getFeedbackById', { feedbackId });

            this.socket.on('getFeedbackByIdSuccess', (data: Feedback) => {
                resolve(data);
            });

            this.socket.on('getFeedbackByIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch feedback'));
            });
        });
    }

    public async getFeedbackByCategoryId(CategoryItemType: any): Promise<Feedback> {
        return new Promise((resolve, reject) => {
            this.socket.emit('getFeedbackByCategoryId', { CategoryItemType });

            this.socket.on('getFeedbackByCategoryIdSuccess', (data: Feedback) => {
                resolve(data);
            });

            this.socket.on('getFeedbackByCategoryIdError', (error: any) => {
                reject(new Error(error.message || 'Failed to fetch feedback'));
            });
        });
    }

    public async updateFeedback(feedbackId, updatedField, updatedValue): Promise<Feedback> {
        return new Promise((resolve, reject) => {
            this.socket.emit('updateFeedback', { feedbackId, updatedField, updatedValue });

            this.socket.on('updateFeedbackSuccess', (data: Feedback) => {
                resolve(data);
            });

            this.socket.on('updateFeedbackError', (error: any) => {
                reject(new Error(error.message || 'Failed to update feedback'));
            });
        });
    }

    public async deleteFeedback(feedback_id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.emit('deleteFeedback', { feedback_id });

            this.socket.on('deleteFeedbackSuccess', () => {
                resolve();
            });

            this.socket.on('deleteFeedbackError', (error: any) => {
                reject(new Error(error.message || 'Failed to delete feedback'));
            });
        });
    }
}

export default FeedbackService;