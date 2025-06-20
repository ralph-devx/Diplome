import { HTMLAttributes } from 'react';
import { IWorkplace } from '../../../networking/models/IWorkplace.ts';


export interface CanvasAdminProps extends HTMLAttributes<HTMLHeadingElement> {
  workplaces: IWorkplace[] | [];
  // onUpdate: (updatedWorkplaces: IWorkplace[]) => void;
  onUpdate: Function;
  refresh: Function;
  floorId: number | null;
}