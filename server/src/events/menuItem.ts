import { Socket } from "socket.io";
import MenuItemController from "../controllers/menuItem";

const menuItemController = new MenuItemController();


export default class MenuItemEventHandler {
    private socket;

    constructor(socket:Socket)
    {
        this.socket = socket;
    }

    public listen(){
        this.socket.on('createMenuItem', async (newMenuItem) => {
            const addItem = menuItemController.createMenuItem(this.socket,newMenuItem);
        });
        
        this.socket.on('updateMenuItem',async(updateFoodItem) => {
            const updateItem = menuItemController.updateMenuItem(this.socket,updateFoodItem);
        })

        this.socket.on('deleteMenuItem',async(deleteItemId) => {
            const updateItem = menuItemController.deleteMenuItem(this.socket,deleteItemId);
        })
        
        this.socket.on('getMenuItems', async() => {
            const MenuItems = menuItemController.getMenuItems(this.socket);
        })
        
        this.socket.on('getMenuItemById', async(foodItemId) => {
            const MenuItems = menuItemController.getMenuItemById(this.socket,foodItemId);
        })
    }
}