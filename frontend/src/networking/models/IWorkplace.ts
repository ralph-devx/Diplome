export interface IWorkplace {
  id: number;
  floor_id: number;
  title: string;
  x: number;
  y: number;
  radius: number;
  createdAt?: string;
  updatedAt?: string;
}


export interface ICreateWorkplace extends Omit<IWorkplace, 'id' | 'createdAt' | 'updatedAt'> {}
