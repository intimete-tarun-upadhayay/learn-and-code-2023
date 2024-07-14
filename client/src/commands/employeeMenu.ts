import PromptSync from "prompt-sync";
import { Socket, io } from "socket.io-client";
import { exit } from "process";
import MenuItemService from "../services/menuItem";
import FeedbackService from "../services/feedback";
import DailyMenuService from "../services/dailyMenuItem";
import RollOutMenuItemService from "../services/rollOutMenuItem";

const prompt = PromptSync();
let menuItemService: MenuItemService;
let feedbackService: FeedbackService;
let rollOutMenuItemService: RollOutMenuItemService;
let dailyMenuService: DailyMenuService;

export default function handleEmpMenuAction(io: Socket,username:string) {
  console.log(`
    1. View Menu
    2. Give Feedback
    3. View Notifications
    4. Choose Items for Upcoming Meal
    5. Exit
    `);
  menuItemService = new MenuItemService(io);
  feedbackService = new FeedbackService(io);
  rollOutMenuItemService = new RollOutMenuItemService(io);
  dailyMenuService = new DailyMenuService(io);
  const adminAction = prompt("Choose Option from above : ");
  switch (adminAction) {
    case "1":
      seeMenuItem(io,username);
      break;
    case "2":
      createFeeback(io,username);
      break;
    case "3":
      // updateMenuItem(io);
      break;
    case "4":
      getRecommendedFoodItems(io,username);
      break;
    case "5":
      exit();
    default:
      // This should never happen since `action` is of type `MenuAction`
      console.log("Unknown action");
      break;
  }
}

const seeMenuItem = async (io: Socket,username:string) => {
  try {
    const MenuItems: any = await menuItemService.getMenuItems();
    const menuItemsDiaplay = MenuItems[0].map((item: any, index: number) => {
      let availability, foodItemType;
      if (item.availabilityStatus == 1) {
        availability = "Available";
      } else {
        availability = "Not Available";
      }
      if (item.foodItemTypeId == 1) {
        foodItemType = "Breakfast";
      } else if (item.foodItemTypeId == 2) {
        foodItemType = "Lunch";
      } else {
        foodItemType = "Dinner";
      }
      return {
        name: item.itemName,
        price: item.price,
        availability_status: availability,
        foodItemType: foodItemType,
      };
    });

    console.table(menuItemsDiaplay);
    console.log("Menu item fetched successfully.");
  } catch (error) {
    console.error("Failed to fetch menu item:", error.message);
  }
  handleEmpMenuAction(io,username);
};

const createFeeback = async (io: Socket,username:string) => {
  try {
    const userId = prompt("Enter User ID : ");
    const foodItemId = prompt("Enter Food Item ID : ");
    const rating = prompt("Enter Rating between 1-5 : ");
    const comment = prompt("Enter Comment for Food Item : ");

    const feedback = { userId, foodItemId, rating, comment };

    const feebackResult = await feedbackService.createFeedback(feedback);
    console.log("Feedback Submitted Successfully.");
  } catch (error) {
    console.error("Error submitting feedback:", error.message);
  }
  handleEmpMenuAction(io,username);
};

const getFeedbackByCategoryId = async (io: Socket,username:string) => {
  try {
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
    handleEmpMenuAction(io,username);
  } catch (error) {
    console.error("Error in Getting Feedback Item:", error.message);
  }
};

const getRecommendedFoodItems = async (io: Socket,username:string) => {
  try {
    console.log(`
        1. Breakfast
        2. Lunch
        3. Dinner
        `);
    const foodItemType = prompt("Choose Food Item Type: ");
    const currentDate = new Date().toISOString().split("T")[0];
    const rollOutItems =
      await rollOutMenuItemService.getDailyRolloutByDateAndCategoryId(
        +foodItemType,
        currentDate,
        username
      );
    const rollOutList = rollOutItems[0].map((item: any, index: number) => {
      return {
        id: item.foodItemId,
        name: item.itemName,
        price: item.price,
        availabilityStatus: item.availabilityStatus,
        AveregeSentimentScore: item.AveregeSentimentScore,
        AveregeRating: item.AveregeRating,
        recommendation: item.recommendation,
      };
    });
    console.table(rollOutList);
    console.log("Choose One Food Item From the List :- ");
    const foodId = prompt("Enter Food Id : ");
    const foodItems = rollOutList.filter((item) => item.id == +foodId);
    console.log("Selected Food Items :- ");
    console.table(foodItems);
    const dailyMenuItem = {
      menuId: foodItems[0].id,
      foodItemTypeId: foodItemType,
      userId:username
    };
    let data = await dailyMenuService.createDailyMenuItem(dailyMenuItem);
    console.log(data);
    handleEmpMenuAction(io,username);
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};
