import pool from "../../src/config/connection";
import FeedbackService from "./feedback";
import MenuItemServices from "./menuItem";
import { SentimentAnalyzer } from "../../utils/SentimentAnalyzer";
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

  private calculateMenuItemScores(feedbacksWithSentimentScore: any[]) {
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
      menuItemScores[feedback.item_id].totalSentiment +=
        feedback.sentiment.score;
      menuItemScores[feedback.item_id].count += 1;
    });

    return menuItemScores;
  }

  private async getFeedbacksWithSentimentScore(CategoryItemType) {
    const feedbacks = await this.feedbackService.getFeedbackByCategoryId({
      CategoryItemType,
    });
    const feedbacksWithSentimentScore = (feedbacks[0] as any[]).map(
      (feedback: any, index: number) => {
        return {
          feedback_id: feedback.reviewId_id,
          item_id: feedback.foodItemId,
          user_id: feedback.userId,
          rating: feedback.rating,
          comment: feedback.comment,
          feedback_date: feedback.date,
          sentiment: this.calculateSentiment(feedback.comment),
        };
      }
    );
    return feedbacksWithSentimentScore;
  }

  public async getRecommendations(CategoryItemType, discardedItems: boolean) {
    const feedbacksWithSentimentScore =
      await this.getFeedbacksWithSentimentScore(CategoryItemType);

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
      menuItemScores[feedback.item_id].totalSentiment +=
        feedback.sentiment.score;
      menuItemScores[feedback.item_id].count += 1;
    });

    let sortedMenuItems;
    if (discardedItems) {
      sortedMenuItems = Object.keys(menuItemScores)
        .map((key: string) => {
          const scoreData = menuItemScores[parseInt(key)];
          const avgRating = scoreData.totalRating / scoreData.count;
          const avgSentimentScore = scoreData.totalSentiment / scoreData.count;
          const weightedScore =
            0.3 * ((avgRating / 5) * 100) + 0.7 * avgSentimentScore;
          return {
            itemId: parseInt(key),
            avgRating,
            avgSentimentScore,
            weightedScore,
          };
        })
        .sort((a, b) => a.avgSentimentScore - b.avgSentimentScore)
        .slice(0, 5);
    } else {
      sortedMenuItems = Object.keys(menuItemScores)
        .map((key: string) => {
          const scoreData = menuItemScores[parseInt(key)];
          const avgRating = scoreData.totalRating / scoreData.count;
          const avgSentimentScore = scoreData.totalSentiment / scoreData.count;
          const weightedScore =
            0.3 * ((avgRating / 5) * 100) + 0.7 * avgSentimentScore;
          return {
            itemId: parseInt(key),
            avgRating,
            avgSentimentScore,
            weightedScore,
          };
        })
        .sort((a, b) => b.weightedScore - a.weightedScore)
        .slice(0, 5);
    }

    const menuItems = await this.menuItem.getMenuItems();

    const menuItemDetails = sortedMenuItems.map((sortedItem) => {
      const menuItem = (menuItems[0] as any[]).find(
        (item) => item.foodItemId === sortedItem.itemId
      );
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
        recommendation,
      };
    });
    return menuItemDetails;
  }

  public async getDiscardableItems(menu_type: string) {
    const feedbacksWithSentimentScore =
      await this.getFeedbacksWithSentimentScore(menu_type);

    const menuItemScores = this.calculateMenuItemScores(
      feedbacksWithSentimentScore
    );
    const discardableItems = Object.keys(menuItemScores).map((key: string) => {
      const scoreData = menuItemScores[parseInt(key)];
      const avgRating = scoreData.totalRating / scoreData.count;
      const avgSentimentScore = scoreData.totalSentiment / scoreData.count;
      return {
        itemId: parseInt(key),
        avgRating,
        avgSentimentScore,
      };
    });

    const discardableFilteredItems = discardableItems.filter(
      (item) => item.avgRating < 2
    );

    const sortedItems = discardableFilteredItems.sort(
      (a, b) => b.avgRating - a.avgRating
    );

    // Fetch menu items using raw SQL query
    const itemIds = sortedItems.map((item) => item.itemId);
    const connect = pool.getConnection();
    try {
      const menuItems = await pool.query(`
        SELECT
        foodItemId,
        itemName,
        foodItemTypeId,
        price,
        availabilityStatus
        FROM
        FoodItem
        WHERE
        foodItemId IN (${itemIds.join(",")})
        `);

      if (!menuItems.length) {
        throw new Error("Menu items not found");
      }

      return sortedItems.map((discardableItem) => {
        const filteredItems = (menuItems[0] as []).filter((item: any) => {
          const isMatch = +item.foodItemId === +discardableItem.itemId;
          return isMatch;
        });

        const menuItem = filteredItems.shift() as any;

        if (menuItem) {
          console.log("Found MenuItem:", menuItem);
        } else {
          console.log("MenuItem not found for itemId:", discardableItem.itemId);
        }

        return {
          id: menuItem.foodItemId,
          name: menuItem.itemName,
          category: menuItem.foodItemTypeId,
          price: menuItem.price,
          availability_status: menuItem.availabilityStatus,
          avg_sentiment_score: discardableItem.avgSentimentScore,
          avg_rating: discardableItem.avgRating,
        };
      });
    } catch (error) {
      throw new Error(`Error fetching discardable items: ${error.message}`);
    }
  }
}
