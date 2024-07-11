import pool from '../../src/config/connection';
import FeedbackService from './feedback';
import MenuItemServices from './menuItem';
import { SentimentAnalyzer } from '../../utils/SentimentAnalyzer';
interface FeedbackAttributes {
    feedback_id: number;
    item_id: number;
    user_id: number;
    rating: number;
    comment: string;
    feedback_date: Date;
    sentiment_score: number;
}
export default class RecommendationEngineServices {

    private feedbackService: FeedbackService;
    private sentimentAnalyzer: SentimentAnalyzer;
    private menuItem: MenuItemServices;

    constructor() {
        this.feedbackService = new FeedbackService();
        this.sentimentAnalyzer = new SentimentAnalyzer();
        this.menuItem = new MenuItemServices();
    }

    private calculateSentiment(comment: string) {
        const sentimentResult = this.sentimentAnalyzer.analyzeSentiment([comment]);
        return sentimentResult;
    }

    private async getFeedbacksWithSentimentScore(CategoryItemType) {
        const feedbacks = await this.feedbackService.getFeedbackByCategoryId({CategoryItemType});
        const feedbacksWithSentimentScore = (feedbacks[0] as any[]).map((feedback:any,index:number) => {
            return {
                feedback_id: feedback.reviewId_id,
                item_id: feedback.foodItemId,
                user_id: feedback.userId,
                rating: feedback.rating,
                comment: feedback.comment,
                feedback_date: feedback.date,
                sentiment: this.calculateSentiment(feedback.comment)
            }
        })
        return feedbacksWithSentimentScore;
    }

    public async getRecommendations(CategoryItemType) {
        const feedbacksWithSentimentScore = await this.getFeedbacksWithSentimentScore(CategoryItemType);

        const menuItemScores: {
            [key: number]: {
                totalRating: number;
                totalSentiment: number;
                count: number;
            };
        } = {};

        feedbacksWithSentimentScore.forEach((feedback) => {
            if (!menuItemScores[feedback.item_id]) {
                menuItemScores[feedback.item_id] = {
                    totalRating: 0,
                    totalSentiment: 0,
                    count: 0,
                };
            }

            menuItemScores[feedback.item_id].totalRating += feedback.rating;
            menuItemScores[feedback.item_id].totalSentiment += feedback.sentiment.score;
            menuItemScores[feedback.item_id].count += 1;
        });

        const sortedMenuItems = Object.keys(menuItemScores)
            .map((key: string) => {
                const scoreData = menuItemScores[parseInt(key)];
                const avgRating = scoreData.totalRating / scoreData.count;
                const avgSentimentScore = scoreData.totalSentiment / scoreData.count;
                const weightedScore = (0.3 * (avgRating / 5 * 100)) + (0.7 * avgSentimentScore);
                return {
                    itemId: parseInt(key),
                    avgRating,
                    avgSentimentScore,
                    weightedScore
                };
            })
            .sort((a, b) => b.avgSentimentScore - a.avgSentimentScore)
            .slice(0, 5);

        const menuItems = await this.menuItem.getMenuItems();

        const menuItemDetails = sortedMenuItems.map((sortedItem) => {
            const menuItem = (menuItems[0] as any[]).find(item => item.foodItemId === sortedItem.itemId);
            if (!menuItem) {
                throw new Error(`MenuItem with id ${sortedItem.itemId} not found`);
            }

            let recommendation: string;
            if (sortedItem.weightedScore >= 80) {
                recommendation = "Highly Recommended";
            } else if (sortedItem.weightedScore >= 60) {
                recommendation = "Good";
            } else if (sortedItem.weightedScore >= 40) {
                recommendation = "Average";
            } else if (sortedItem.weightedScore >= 20) {
                recommendation = "Bad";
            } else {
                recommendation = "Avoid";
            }

            return {
                id: menuItem.foodItemId,
                name: menuItem.itemName,
                category: menuItem.foodItemTypeId,
                price: menuItem.price,
                availability_status: menuItem.availabilityStatus,
                avg_sentiment_score: sortedItem.avgSentimentScore,
                avg_rating: sortedItem.avgRating,
                recommendation
            };
        });
        return menuItemDetails;
    }

}
