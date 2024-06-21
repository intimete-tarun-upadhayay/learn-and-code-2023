import express from 'express';
import http from 'http';
import { Message } from '../common/common';
import { Server } from 'socket.io';
import pool from './src/config/connection';

const PORT = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const connectedClients: { [socketId: string]: string } = {}; // Map socket ID to client name

const userLogin =  async (username:string,password:string) => {
  const connect = pool.getConnection();
  const [user]:any =  await pool.query(`select u.role_id from user u inner join user_authentication ua on u.usero_id = ua.user_id where u.usero_id = '${username}';`);
  console.log(user[0]);
  (await connect).release();
  io.emit('loggedin',user[0].role_id);
};

const createMenuItem = async (menuItem) => {
  console.log(menuItem.name);
  try {
    const connect = pool.getConnection();
    const data = await pool.query(`insert into FoodItem (itemName,price,availabilityStatus,foodItemTypeId) values('${menuItem.name}','${menuItem.price}','${menuItem.availability_status}','${menuItem.foodItemTypeId}')`);
    (await connect).release();
    io.emit('createMenuItemSuccess', menuItem);
  } catch (error) {
    io.emit('createMenuItemError', { error: error.message });
  }
};

const updateMenuItem = async (updateFoodItem) => {
  console.log(updateFoodItem);
  try {
    if (!updateFoodItem) {
      throw new Error("Menu item not found");
  }
    const connect = pool.getConnection();
    const updateItem = await pool.query(`update FoodItem set ${updateFoodItem.menuItem.updatedField} = '${updateFoodItem.menuItem.updatedValue}' where foodItemId = '${updateFoodItem.id}'`);
    console.log(updateItem);
    (await connect).release();
    io.emit('updateMenuItemSuccess', updateItem);
  } catch (error) {
    io.emit('updateMenuItemError', { error });
  }
}

const deleteMenuItem = async (deleteItemId) => {
  try {
    const connect = pool.getConnection();
    const deleteItem = await pool.query(`delete from FoodItem where foodItemId = '${deleteItemId.id}'`);
    console.log(deleteItem);
    io.emit('deleteMenuItemSuccess');
  } catch (error) {
    io.emit('deleteMenuItemError', { error: error.message });
  }
}

const getMenuItems = async () => {
  try {
    const connect = pool.getConnection();
    const menuItems = await pool.query(`select itemName, price,availabilityStatus,foodItemTypeId from FoodItem`);
    console.log(menuItems);
    
    io.emit('getMenuItemsSuccess', menuItems);
  } catch (error) {
    io.emit('getMenuItemsError', { error: error.message });
  }
};

io.on('connection', (socket) => {

  socket.on('login',({username,password}) => {
    const user = userLogin(username,password);
    console.log(user);
  });

  socket.on('createMenuItem', async (newMenuItem) => {
    const addItem = createMenuItem(newMenuItem);
  });

  socket.on('updateMenuItem',async(updateFoodItem) => {
    const updateItem = updateMenuItem(updateFoodItem);
  })

  socket.on('deleteMenuItem',async(deleteItemId) => {
    const updateItem = deleteMenuItem(deleteItemId);
  })

  socket.on('getMenuItems', async() => {
    const MenuItems = getMenuItems();
  })

});



server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
