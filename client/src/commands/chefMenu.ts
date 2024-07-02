import PromptSync from "prompt-sync";
import { Socket } from 'socket.io-client';
import { exit } from "process";
import RecommendationEngineServices from "../services/recommendationEngine";

const prompt = PromptSync();
let recommendationEngineServices:RecommendationEngineServices;

export default function handleChefMenuAction(io:Socket) {
    console.log(`
    1. Propose Daily Menu
    2. Generate Monthly Feedback Report
    3. View Feedback
    4. Exit
    `);
    recommendationEngineServices = new RecommendationEngineServices(io);
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


const proposeDailyMenuItem = (io:Socket) => {
    console.log(`
    1. Breakfast
    2. Lunch
    3. Dinner
    `);
    const CategoryItemType = prompt("Choose Option from above : ");
    let recommendatedItem;
    switch (CategoryItemType) {
        case '1':
            recommendatedItem = recommendationEngineServices.recommendationEngine(CategoryItemType);
            break;
        case '2':
            // seeMenuItem(io);
            break;
        case '3':
            // updateMenuItem(io);
            break;
        default:
            // This should never happen since `action` is of type `MenuAction`
            console.log('Unknown action');
            break;
    }
    handleChefMenuAction(io);
}
