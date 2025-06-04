import { IUser } from '../networking/models/IUser.ts';
import { makeAutoObservable } from 'mobx';
import AuthService from '../networking/services/AuthService.ts';
import { AxiosError } from 'axios';
import { AuthResponse } from '../networking/models/response/AuthResponse.ts';
import $api from '../networking/http';
import { IOffice } from '../networking/models/IOffice.ts';


export default class Store {
  user = {} as IUser;
  isAuth = false;
  ROLES = [
    {
      id: 1,
      text: 'ADMIN'
    },
    {
      id: 2,
      text: 'MANAGER'
    },
    {
      id: 3,
      text: 'USER'
    }
  ];
  offices = [] as IOffice[];
  
  
  constructor() {
    makeAutoObservable(this);
  }
  
  setAuth(bool: boolean) {
    this.isAuth = bool;
  }
  
  setUser(user: IUser) {
    this.user = user;
  }
  
  async login(login: string, password: string) {
    try {
      const response = await AuthService.login(login, password);
      console.log(response);
      // localStorage.setItem('jwt', JSON.stringify(response.data.token));
      localStorage.setItem('jwt', response.data.token);
      this.setAuth(true);
      this.setUser(response.data.user);
      return true;
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e.response?.data?.message);
      }
    }
  }
  
  async checkAuth() {
    // const res = await axios.get<AuthResponse>(`${API_URL}/auth/check`, {withCredentials: true});
    // const res = await $api.get<AuthResponse>('/auth/check');
    try {
      // const res = await axios.get<AuthResponse>(`${API_URL}/auth/check`, {withCredentials: true});
      const res = await $api.get<AuthResponse>('/auth/check');
      // console.log(res);
      localStorage.setItem('jwt', res.data.token);
      this.setAuth(true);
      this.setUser(res.data.user);
      return true;
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e.response?.data?.message);
      }
      return false;
    }
  }
  
  logout() {
    try {
      localStorage.removeItem('jwt');
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e.response?.data?.message);
      }
    }
  }
}