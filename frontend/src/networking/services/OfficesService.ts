import $api from '../http';


export default class OfficesService {
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