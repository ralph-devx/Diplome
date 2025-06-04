import { IWorkplace } from './IWorkplace.ts';


export interface IFloor {
  id: number;
  level: number;
  workplaces?: IWorkplace[];
  createdAt?: string;
  updatedAt?: string;
}