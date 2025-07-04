import { IFloor } from './IFloor.ts';


export interface IOffice {
  id: number;
  name: string;
  address: string;
  floors?: IFloor[];
  createdAt?: string;
  updatedAt?: string;
}


export interface ICreateOffice extends Omit<IOffice, 'id' | 'createdAt' | 'updatedAt'> {}
