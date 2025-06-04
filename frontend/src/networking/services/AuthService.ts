import $api from '../http';
import {AxiosResponse} from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';


export default class AuthService {
  static async login(login: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/auth', {login, password});
  }
}