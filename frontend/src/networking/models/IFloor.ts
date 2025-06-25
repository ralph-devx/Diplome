import { IWorkplace } from './IWorkplace.ts';


export interface IFloor {
  id: number;
  office_id: number;
  level: number;
  workplaces?: IWorkplace[];
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface ICreateFloor extends Omit<IFloor, 'id' | 'createdAt' | 'updatedAt' | 'workplaces'> {}
