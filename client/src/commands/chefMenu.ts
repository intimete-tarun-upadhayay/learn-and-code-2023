import PromptSync from "prompt-sync";
import { Socket } from "socket.io-client";
import { exit } from "process";
import RecommendationEngineServices from "../services/recommendationEngine";
import RollOutMenuItemService from "../services/rollOutMenuItem";
import FeedbackService from "../services/feedback";

const prompt = PromptSync();
let recommendationEngineServices: RecommendationEngineServices;
let rollOutMenuItemService: RollOutMenuItemService;
let feedbackService: FeedbackService;

export default function handleChefMenuAction(io: Socket) {
  console.log(`
    1. Propose Daily Menu
    2. Generate Monthly Feedback Report
    3. View Feedback
    4. Show Discarded Food Items
    5. Exit
    `);
  recommendationEngineServices = new RecommendationEngineServices(io);
  rollOutMenuItemService = new RollOutMenuItemService(io);
  feedbackService = new FeedbackService(io);
  const adminAction = prompt("Choose Option from above : ");
  switch (adminAction) {
    case "1":
      proposeDailyMenuItem(io);
      break;
    case "2":
      // seeMenuItem(io);
      break;
    case "3":
      getFeedbackByCategoryId(io);
      break;
    case "4":
      showDiscardedMenuItem(io);
      break;
    case "5":
      exit();
    default:
      // This should never happen since `action` is of type `MenuAction`
      console.log("Unknown action");
      break;
  }
}

const proposeDailyMenuItem = async (io: Socket) => {
  console.log(`
    1. Breakfast
    2. Lunch
    3. Dinner
    `);
  const CategoryItemType = prompt("Choose Option from above : ");
  const recommendatedItem =
    await recommendationEngineServices.recommendationEngine(+CategoryItemType,false);
  console.table(recommendatedItem);
  console.log("Choose Three Food Item From the List :- ");
  const foodItem1 = prompt("Enter 1st Food Id : ");
  const foodItem2 = prompt("Enter 2nd Food Id : ");
  const foodItem3 = prompt("Enter 3rd Food Id : ");
  const foodItems = [+foodItem1, +foodItem2, +foodItem3];
  const selectedFoodItems = recommendatedItem.filter((item) =>
    foodItems.includes(item.id)
  );
  console.log("Selected Food Items :- ");
  console.table(selectedFoodItems);
  let data = await rollOutMenuItemService.createDailyRollout(selectedFoodItems);

  handleChefMenuAction(io);
};

const showDiscardedMenuItem = async (io: Socket) => {
  console.log(`
    1. Breakfast
    2. Lunch
    3. Dinner
    `);
  const CategoryItemType = prompt("Choose Option from above : ");
  const recommendatedItem =
    await recommendationEngineServices.recommendationEngine(+CategoryItemType,true);
  console.table(recommendatedItem);
  console.log("Choose Discarded Food Item From the List :- ");
  const foodItem = prompt("Enter Food Id : ");
  const selectedFoodItems = recommendatedItem.filter((item) =>
    item.id === +foodItem
  );
  console.log("Selected Food Item :- ");
  console.table(selectedFoodItems);
  // let data = await rollOutMenuItemService.createDailyRollout(selectedFoodItems);

  handleChefMenuAction(io);
};

const getFeedbackByCategoryId = async (io: Socket) => {
  try {
    console.log(`
      1. Breakfast
      2. Lunch
      3. Dinner
      `);
    const CategoryItemType = prompt("Enter Category Id of Food Item :- ");
    const feedbacks = await feedbackService.getFeedbackByCategoryId(
      CategoryItemType
    );

    const feedbackDisplay = feedbacks[0].map((item: any, index: number) => {
      return {
        reviewId: item.reviewId,
        userId: item.userId,
        foodItemId: item.foodItemId,
        rating: item.rating,
        comment: item.comment,
        date: item.date,
      };
    });
    console.table(feedbackDisplay);
    handleChefMenuAction(io);
  } catch (error) {
    console.error("Error in Getting Feedback Item:", error.message);
  }
};
