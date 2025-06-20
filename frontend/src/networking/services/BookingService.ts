import $api from '../http';
import { IBooking } from '../models/IBooking.ts';


export default class BookingService {
  static async getBookings() {
    return $api.get('/booking');
  }
  
  static async getNotIncludeBookings() {
    return $api.get('/booking/notinclude');
  }
  
  static async createBooking(data: IBooking) {
    return $api.post(`/booking`, data);
  }
  
  static async deleteBook(id: number) {
    return $api.delete(`/booking?id=${id}`);
  }
  
  // static async getOfficesInclude() {
  //   return $api.get("/offices");
  // }
  //
  // static async getOfficesOnly() {
  //   return $api.get("/offices/offices");
  // }
  //
  // static async getFloors(id: number) {
  //   return $api.get(`/offices/floors?id=${id}`);
  // }
  //
  // static async getWorkplaces(id: number) {
  //   return $api.get(`/offices/workplace?id=${id}`);
  // }
}