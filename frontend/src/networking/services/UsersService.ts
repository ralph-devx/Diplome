import $api from '../http';
import { ICreateUsers, IUser } from '../models/IUser.ts';


export default class UsersService {
  static async getAll() {
    return $api.get("/users");
  }
  
  static async update(user: IUser) {
    return $api.post("/users/update", user);
  }
  
  static async delete(id: number) {
    return $api.post(`/users/delete?id=${id}`);
  }
  
  static async create(user: ICreateUsers) {
    return $api.post(`/users`, user);
  }
  
  static async getUserById(id: number) {
    return $api.get(`/users/user/?id=${id}`);
  }
}