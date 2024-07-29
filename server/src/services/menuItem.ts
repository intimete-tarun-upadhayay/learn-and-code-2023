import pool from '../../src/config/connection';

export default class MenuItemServices {

    public createMenuItem = async (name, price, availability_status, foodItemTypeId,dietarypreference,
        spiceLevel,
        statePreference,
        isSweet) => {
        const connect = pool.getConnection();
        const data = await pool.query(`insert into FoodItem (itemName,price,availabilityStatus,foodItemTypeId,dietary_preference,spice_level,state_preference,is_sweet) values('${name}','${price}','${availability_status}','${foodItemTypeId}','${dietarypreference}','${spiceLevel}','${statePreference}','${isSweet}')`);
        (await connect).release();
    }

    public updateMenuItem = async (menuItem,id) => {
        const connect = pool.getConnection();
        const updateItem = await pool.query(`update FoodItem set ${menuItem.updatedField} = '${menuItem.updatedValue}' where foodItemId = '${id}'`);
        (await connect).release();
    }

    public deleteMenuItem = async (deleteItemId) => {
      const connect = pool.getConnection();
      const deleteItem = await pool.query(`delete from FoodItem where foodItemId = '${deleteItemId.id}'`);
      console.log(deleteItem);
    }

    public getMenuItems = async () => {
        const connect = pool.getConnection();
        const menuItems = await pool.query(`select foodItemId,itemName, price,availabilityStatus,foodItemTypeId from FoodItem`);
        return menuItems;
    }

    public getMenuItemById = async (foodItemId) => {
        const connect = pool.getConnection();
        const menuItems = await pool.query(`select itemName from FoodItem where foodItemId = '${foodItemId.id}'`);
        return menuItems;
    }
}
