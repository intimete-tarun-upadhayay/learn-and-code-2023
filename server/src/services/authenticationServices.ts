import { error } from 'console';
import pool from '../config/connection';

class authenticationService {

      public userLogin =  async (username:string,password:string) => {
        try {
          const connect = pool.getConnection();
          const [user]:any =  await pool.query(`select u.role_id from user u inner join user_authentication ua on u.user_id = ua.user_id where u.user_id = '${username}' and ua.password = '${password}';`);
          console.log("role : ",user[0].role_id);
          if(!user[0].role_id)
          {
            throw new Error("Invaild employee username or password");
          }
          (await connect).release();
          return user[0].role_id;
        } catch (error) {
          throw new Error(error.message);
        }
        
      };

}

export default authenticationService;
