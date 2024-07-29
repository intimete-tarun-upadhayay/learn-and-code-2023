import MenuItemService from "./menuItem";
// import MenuAttributesService from "./menuAttributes";
// import EmployeePreferencesService from "./employeePreferences";
import pool from "../config/connection";

const menuItemService = new MenuItemService();
// const menuAttributesService = new MenuAttributesService()
// const employeePreferencesService = new EmployeePreferencesService()

class NotificationService {

  async createNotification(notificationData: string, itemName: string) {
    try {
      const connect = pool.getConnection();
      const data = await pool.query(
        `insert into Notification (message,itemName) values('${notificationData}','${itemName}')`
      );
      (await connect).release();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteNotification(notification_id: number) {
    try {
      const connect = pool.getConnection();
      const data = await pool.query(
        `delete from table Notification where notificationId ='${notification_id}'`
      );
      (await connect).release();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getNotificationByDate(user: any) {
    try {
      const connect = pool.getConnection();
      const data = await pool.query(`
        SELECT 
    n.notificationId, 
    n.message, 
    n.date, 
    n.itemName
FROM 
    Notification n
JOIN 
    FoodItem f ON n.itemName = f.itemName
JOIN 
    user_preference u ON (
        u.isvegetarian = f.dietary_preference AND 
        u.spice_level = f.spice_level AND 
        u.state_preference = f.state_preference AND
        u.like_sweet = f.is_sweet
    )
WHERE 
    u.user_id = '${user}';
            `);
      return data;
      (await connect).release();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getNotificationById(notification_id: number) {
    try {
      const connect = pool.getConnection();
      const data = await pool.query(
        `select * from Notification where notificationId ='${notification_id}'`
      );
      (await connect).release();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getNotifications() {
    try {
      const connect = pool.getConnection();
      const data = await pool.query(`select * from Notification`);
      (await connect).release();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateNotification(
    notification_id: number,
    notification_type:
      | "new_breakfast_menu"
      | "new_lunch_menu"
      | "new_dinner_menu"
      | "item_added"
      | "item_status_change",
    notification_data: any,
    notification_timestamp: string
  ) {
    try {
      // const notification = await Notification.findByPk(notification_id);
      // if (!notification) {
      //     throw new Error("Notification not found");
      // }
      // notification.notification_type = notification_type;
      // notification.notification_data = notification_data;
      // notification.notification_timestamp = notification_timestamp;
      // await notification.save();
      // return notification;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default NotificationService;
