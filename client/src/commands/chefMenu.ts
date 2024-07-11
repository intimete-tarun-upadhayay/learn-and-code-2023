import PromptSync from "prompt-sync";
import { Socket } from 'socket.io-client';
import { exit } from "process";
import RecommendationEngineServices from "../services/recommendationEngine";
import RollOutMenuItemService from "../services/rollOutMenuItem";

const prompt = PromptSync();
let recommendationEngineServices:RecommendationEngineServices;
let rollOutMenuItemService:RollOutMenuItemService;

export default function handleChefMenuAction(io:Socket) {
    console.log(`
    1. Propose Daily Menu
    2. Generate Monthly Feedback Report
    3. View Feedback
    4. Exit
    `);
    recommendationEngineServices = new RecommendationEngineServices(io);
    rollOutMenuItemService = new RollOutMenuItemService(io);
    const adminAction = prompt("Choose Option from above : ");
    switch (adminAction) {
        case '1':
            proposeDailyMenuItem(io);
            break;
        case '2':
            // seeMenuItem(io);
            break;
        case '3':
            // updateMenuItem(io);
            break;
        case '4':
            exit();
        default:
            // This should never happen since `action` is of type `MenuAction`
            console.log('Unknown action');
            break;
    }
}


const proposeDailyMenuItem = async (io:Socket) => {
    console.log(`
    1. Breakfast
    2. Lunch
    3. Dinner
    `);
    const CategoryItemType = prompt("Choose Option from above : ");
    const recommendatedItem = await recommendationEngineServices.recommendationEngine(+CategoryItemType);
    console.table(recommendatedItem);
    console.log("Choose Three Food Item From the List :- ");
    const foodItem1 = prompt("Enter 1st Food Id : ");
    const foodItem2 = prompt("Enter 2nd Food Id : ");
    const foodItem3 = prompt("Enter 3rd Food Id : ");
    const foodItems = [+foodItem1, +foodItem2, +foodItem3];
    const selectedFoodItems = recommendatedItem.filter(item => foodItems.includes(item.id));
    console.log("Selected Food Items :- ");
    console.table(selectedFoodItems);
    let data = await rollOutMenuItemService.createDailyRollout(selectedFoodItems);
    
    handleChefMenuAction(io);
}
