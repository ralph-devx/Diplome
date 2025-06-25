import $api from '../http';
import { ICreateFloor } from '../models/IFloor.ts';
import { ICreateWorkplace, IWorkplace } from '../models/IWorkplace.ts';
import { ICreateOffice, IOffice } from '../models/IOffice.ts';
import { AxiosRequestConfig, AxiosResponse } from 'axios';


export default class OfficesService {
  static async createOffice(data: ICreateOffice) {
    return $api.post('/offices', data);
  }
  static async getOfficesInclude() {
    return $api.get<IOffice[]>("/offices");
  }
  static async getOfficesOnly() {
    return $api.get("/offices/offices");
  }
  static async deleteOffice(id: number) {
    return $api.delete(`/offices/offices?id=${id}`);
  }
  static async updateOffice(office: IOffice) {
    return $api.post("/offices/update", office);
  }
  
  static async getFloors(id: number) {
    return $api.get(`/offices/floors?id=${id}`);
  }
  static async createFloor(data: ICreateFloor) {
    return $api.post('/offices/floor', data);
  }
  static async deleteFloors(id: number) {
    return $api.delete(`/offices/floors?id=${id}`);
  }
  // static async getFloorImage(id: number) {
  //
  // }
  static async updateFloorImage(id: number, file: FormData) {
    const config: AxiosRequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    return $api.post(`/offices/floor/image?id=${id}`, file, config);
  }
  
  static async createWorkplace(data: ICreateWorkplace) {
    return $api.post('/offices/workplace', data);
  }
  static async getWorkplaces(id: number) {
    return $api.get<IWorkplace[]>(`/offices/workplace?id=${id}`);
  }
  static async updateWorkplace(wp: IWorkplace[]): Promise<AxiosResponse<IWorkplace[]>> {
    return $api.post(`/offices/workplace/update/`, wp);
  }
  static async deleteWorkplace(id: number) {
    return $api.delete(`/offices/workplace?id=${id}`);
  }
}