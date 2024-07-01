import PromptSync from "prompt-sync";
import { Socket, io } from "socket.io-client";
import { exit } from "process";
import MenuItemService from "../services/menuItem";
import FeedbackService from "../services/feedback";

const prompt = PromptSync();
let menuItemService: MenuItemService;
let feedbackService:FeedbackService;

export default function handleEmpMenuAction(io:Socket) {
    console.log(`
    1. View Menu
    2. Give Feedback
    3. View Notifications
    4. Choose Items for Upcoming Meal
    5. Exit
    `);
    menuItemService = new MenuItemService(io);
    feedbackService = new FeedbackService(io);
    const adminAction = prompt("Choose Option from above : ");
    switch (adminAction) {
        case '1':
            seeMenuItem(io);
            break;
        case '2':
            createFeeback(io);
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

const seeMenuItem = async (io:Socket) =>{
    try {
        const MenuItems: any = await menuItemService.getMenuItems();       
        const menuItemsDiaplay = MenuItems[0].map((item: any,index:number) => {
            let availability,foodItemType;
            if(item.availabilityStatus == 1)
            {
                availability = "Available";
            }
            else
            {
                availability = "Not Available";
            }
            if(item.foodItemTypeId == 1)
            {
                foodItemType = 'Breakfast';
            }
            else if(item.foodItemTypeId == 2)
            {
                foodItemType = 'Lunch';
            }
            else
            {
                foodItemType = 'Dinner';
            }
            return {
                name: item.itemName,
                price: item.price,
                availability_status: availability,
                foodItemType: foodItemType
            }
        })
        
        console.table(menuItemsDiaplay);
        console.log('Menu item fetched successfully.');
    } catch (error) {
        console.error('Failed to fetch menu item:', error.message);
    }
    handleEmpMenuAction(io);
}

const createFeeback = async (io:Socket) => {
    try {
        const userId = prompt('Enter User ID : ');
        const foodItemId = prompt('Enter Food Item ID : ');
        const rating = prompt("Enter Rating between 1-5 : ");
        const comment = prompt("Enter Comment for Food Item : ");

        const feedback = {userId,foodItemId,rating,comment};
        console.log(feedback);
        
        const feeback = await feedbackService.createFeedback(feedback);
        console.log('Feedback Submitted Successfully.');

    } catch (error) {
        console.error('Error submitting feedback:', error.message);
    }
    handleEmpMenuAction(io);
}