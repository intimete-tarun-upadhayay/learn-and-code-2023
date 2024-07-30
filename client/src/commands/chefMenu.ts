import PromptSync from "prompt-sync";
import { Socket } from "socket.io-client";
import { exit } from "process";
import RecommendationEngineServices from "../services/recommendationEngine";
import RollOutMenuItemService from "../services/rollOutMenuItem";
import MenuItemService from "../services/menuItem";
import NotificationService from "../services/notification";
import FeedbackService from "../services/feedback";
import DailyMenuItemService from "../services/dailyMenuItem";

const prompt = PromptSync();
let recommendationEngineServices: RecommendationEngineServices;
let rollOutMenuItemService: RollOutMenuItemService;
let feedbackService: FeedbackService;
let dailyMenu: DailyMenuItemService;
let menuItemService: MenuItemService;
let notificationService: NotificationService;

export default function handleChefMenuAction(io: Socket) {
  console.log(`
    1. Propose Daily Menu
    2. Select Menu Item Tommorrow Menu Item. 
    3. View Feedback
    4. Show Discarded Food Items
    5. Exit
    `);
  recommendationEngineServices = new RecommendationEngineServices(io);
  rollOutMenuItemService = new RollOutMenuItemService(io);
  feedbackService = new FeedbackService(io);
  menuItemService = new MenuItemService(io);
  notificationService = new NotificationService(io);
  const adminAction = prompt("Choose Option from above : ");
  switch (adminAction) {
    case "1":
      proposeDailyMenuItem(io);
      break;
    case "2":
      selectMenuItem(io);
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
    await recommendationEngineServices.recommendationEngine(+CategoryItemType);
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
    await recommendationEngineServices.getdiscardedMenuItems(+CategoryItemType);
  console.table(recommendatedItem);
  console.log("Choose Discarded Food Item From the List :- ");
  const foodItem = prompt("Enter Food Id : ");
  const selectedFoodItems = recommendatedItem.filter((item) =>
    item.id === +foodItem
  );
  console.log("Selected Food Item :- ");
  console.table(selectedFoodItems);
  await recommendationEngineServices.addDiscardedMenuItem(selectedFoodItems[0]);
  const deleteItem = prompt("Do you want to delete this item? (Yes - 1/No - 0) : ");
  if (deleteItem === '1') {
    const deleteMenuItem = await menuItemService.deleteMenuItem(+selectedFoodItems[0].id);
    console.log('Menu item deleted successfully');
    const foodItemName = (foodItem as any)[0][0].itemName;
    const notification = await notificationService.createNotification({ notification_data: `Food Item ${foodItemName} deleted from Menu`, itemName: foodItemName });
    console.log('Notification sent successfully');
  }
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

const selectMenuItem = async (io: Socket) => {
  try {
    console.log(`
      1. Breakfast
      2. Lunch
      3. Dinner
      `);
    const CategoryItemType = prompt("Enter Category Id of Food Item :- ");
    const currentDate = new Date().toISOString().split("T")[0];
    let dailyRollOutItem = await rollOutMenuItemService.getDailyRolloutById(+CategoryItemType);
    const dailyMenuItems = dailyRollOutItem[0].map((item: any, index: number) => {
      return {
        id: item.foodItemId,
        itemName: item.itemName,
        price: item.price,
        category: item.foodItemTypeId,
        Averege_Sentiment_Score: item.AveregeSentimentScore,
        recommendation: item.recommendation,
      };
    });
    console.table(dailyMenuItems);
    console.log("Select Food Item for Next: - ");
    const foodItemId = prompt("Enter Food Item Id: ");
    const foodItems = dailyMenuItems.filter((item) => item.id == +foodItemId);
    dailyMenu.createDailyMenuItem(foodItems);
    console.log("Selected Food Items :- ");
    console.table(foodItems);
    handleChefMenuAction(io);
  } catch (error) {
    console.error("Error in Daily Menu Item:", error.message);
  }
};