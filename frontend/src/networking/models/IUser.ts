export interface IUser {
  id: number;
  login: string;
  password: string;
  name: string;
  surname: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateUsers extends Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> {}