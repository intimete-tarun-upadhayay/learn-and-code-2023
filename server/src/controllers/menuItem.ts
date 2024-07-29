import { Socket } from "socket.io";
import MenuItemServices from "../services/menuItem";

export default class MenuItemController {
  private menuItemService: MenuItemServices;

  constructor() {
    this.menuItemService = new MenuItemServices();
  }

  public createMenuItem = async (socket: Socket, menuItem: any) => {
    const { name, price, availability_status, foodItemTypeId, dietarypreference,
      spiceLevel,
      statePreference,
      isSweet } = menuItem;
    this.menuItemService.createMenuItem(name, price, availability_status, foodItemTypeId, dietarypreference,spiceLevel,
      statePreference,
      isSweet);
    try {
      socket.emit('createMenuItemSuccess', menuItem);
    } catch (error) {
      socket.emit('createMenuItemError', { error: error.message });
    }
  };

  public updateMenuItem = async (socket: Socket, updateFoodItem: any) => {
    try {
      if (!updateFoodItem) {
        throw new Error("Menu item not found");
      }
      const { menuItem, id } = updateFoodItem;
      await this.menuItemService.updateMenuItem(menuItem, id);
      socket.emit('updateMenuItemSuccess', menuItem);
    } catch (error) {
      socket.emit('updateMenuItemError', { error });
    }
  }

  public deleteMenuItem = async (socket: Socket, deleteItemId: any) => {
    try {
      await this.menuItemService.deleteMenuItem(deleteItemId);
      socket.emit('deleteMenuItemSuccess');
    } catch (error) {
      socket.emit('deleteMenuItemError', { error: error.message });
    }
  }

  public getMenuItems = async (socket: Socket) => {
    try {
      const menuItems = await this.menuItemService.getMenuItems();
      socket.emit('getMenuItemsSuccess', menuItems);
    } catch (error) {
      socket.emit('getMenuItemsError', { error: error.message });
    }
  }

  public getMenuItemById = async (socket: Socket, foodItemId: any) => {
    try {
      const menuItems = await this.menuItemService.getMenuItemById(foodItemId);
      socket.emit('getMenuItemByIdSuccess', menuItems);
    } catch (error) {
      socket.emit('getMenuItemByIdError', { error: error.message });
    }
  }
}
