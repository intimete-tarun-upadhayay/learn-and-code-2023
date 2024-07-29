import PromptSync from "prompt-sync";
import { Socket, io } from "socket.io-client";
import { MenuItem } from "../types/menuItem";
import MenuItemService from "../services/menuItem";
import NotificationService from "../services/notification";
import { exit } from "process";

const prompt = PromptSync();
let menuItemService: MenuItemService;
let notificationService: NotificationService;

function handleAdminMenuAction(io:Socket): void {
    console.log(`
    1. Add Menu Item
    2. See Menu Item
    3. Update Menu Item
    4. Delete Menu Item
    5. Exit
    `);
    menuItemService = new MenuItemService(io);
    notificationService = new NotificationService(io);
    const adminAction = prompt("Choose Option from above : ");
    switch (adminAction) {
        case '1':
            addMenuItem(io);
            break;
        case '2':
            seeMenuItem(io);
            break;
        case '3':
            updateMenuItem(io);
            break;
        case '4':
            deleteMenuItem(io);
            break;
        case '5':
            exit();
            break;
        default:
            console.log('Unknown action');
            break;
    }
}


const addMenuItem = async (io:Socket) =>{
    const foodName = prompt("Enter Food Name : ");
    const foodPrice = prompt("Enter Food Price : ");
    const foodAvailabilityStatus = prompt("Enter Food Availability Status : ");
    const foodItemTypeId = prompt("Enter Food Item Type : ");
    const dietarypreference = prompt("Enter Dietary Preference (veg/non-veg/egg) : ");
    const spiceLevel = prompt("Enter Spice Level (high/medium/low) : ");
    const statePreference = prompt("Enter State Preference  (north/south/other) : ");
    const isSweet = prompt("Is Sweet (yes/no) : ");

    const newItem:MenuItem = {
        name:foodName,
        price:+foodPrice,
        availability_status:+foodAvailabilityStatus,
        foodItemTypeId:+foodItemTypeId,
        dietarypreference:dietarypreference,
        spiceLevel:spiceLevel,
        statePreference:statePreference,
        isSweet:isSweet
    }
    try {
        const menuItem = await menuItemService.createMenuItem(newItem);
        console.log('Menu item added successfully:', menuItem);
        const notification = await notificationService.createNotification({notification_data:`Add ${foodName} in Menu`,itemName: foodName});
        console.log('Notification sent successfully');
        
    } catch (error: any) {
        console.error('Failed to add menu item:', error.message);
    }
    handleAdminMenuAction(io);
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
    handleAdminMenuAction(io);
}
const updateMenuItem = async (io:Socket) =>{
    const foodItemId = prompt("Enter Food Item ID for Updated Item : ");
    let updateFoodItem = {};
    let updatedValue;
    const updatedField = prompt("Enter name of field you want update : ");
    switch (updatedField) {
        case 'itemName':
            updatedValue = prompt("Enter updated value : ");
            updateFoodItem = {updatedField,updatedValue}
            break;
        case 'price':
            updatedValue = prompt("Enter updated value : ");
            updateFoodItem = {updatedField,updatedValue}
            break;
        case 'availabilityStatus':
            updatedValue = prompt("Enter updated value : ");
            updateFoodItem = {updatedField,updatedValue}
            break;
        case 'foodItemTypeId':
            updatedValue = prompt("Enter updated value : ");
            updateFoodItem = {updatedField,updatedValue}
            break;
        default:
            throw new Error('Unknown query type');
    }
    try {
        const menuItem = await menuItemService.updateMenuItem(+foodItemId,updateFoodItem);
        console.log('Menu item updated successfully');
        const foodItem = await menuItemService.getMenuItemById(+foodItemId);
        const foodItemName = (foodItem as any)[0][0].itemName;
        const notification = await notificationService.createNotification({notification_data:`Update values of ${foodItemName}`,itemName: foodItemName});
        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Failed to update menu item:', error.message);
    }
    handleAdminMenuAction(io);
}
const deleteMenuItem = async (io:Socket) =>{
    const foodItemId = prompt("Enter Food Item ID for Deleted Item : ");
    try {
        const foodItem = await menuItemService.getMenuItemById(+foodItemId);
        const deleteMenuItem = await menuItemService.deleteMenuItem(+foodItemId);
        console.log('Menu item deleted successfully');
        const foodItemName = (foodItem as any)[0][0].itemName;
        const notification = await notificationService.createNotification({notification_data:`Food Item ${foodItemName} deleted from Menu`,itemName: foodItemName});
        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Failed to delete menu item:', error);
    }
    handleAdminMenuAction(io);
}




export default handleAdminMenuAction;