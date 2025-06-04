import { IUser } from '../IUser.ts';


export interface AuthResponse {
  token: string;
  user: IUser;
}