import $api from '../http';
import { ICreateFloor } from '../models/IFloor.ts';
import { ICreateWorkplace } from '../models/IWorkplace.ts';
import { ICreateOffice } from '../models/IOffice.ts';


export default class OfficesService {
  static async createOffice(data: ICreateOffice) {
    return $api.post('/offices', data);
  }
  
  static async createFloor(data: ICreateFloor) {
    return $api.post('/offices/floor', data);
  }
  
  static async createWorkplace(data: ICreateWorkplace) {
    return $api.post('/offices/workplace', data);
  }
  
  static async getOfficesInclude() {
    return $api.get("/offices");
  }
  
  static async getOfficesOnly() {
    return $api.get("/offices/offices");
  }
  
  static async getFloors(id: number) {
    return $api.get(`/offices/floors?id=${id}`);
  }
  
  static async getWorkplaces(id: number) {
    return $api.get(`/offices/workplace?id=${id}`);
  }
  
  // static async delete(id: number) {
  //   return $api.post(`/users/delete?id=${id}`);
  // }
}