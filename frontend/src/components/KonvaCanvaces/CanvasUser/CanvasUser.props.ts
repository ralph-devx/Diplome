import { HTMLAttributes } from 'react';
import { IWorkplace } from '../../../networking/models/IWorkplace.ts';
import { IBooking } from '../../../networking/models/IBooking.ts';


export interface CanvasUserProps extends HTMLAttributes<HTMLDivElement> {
  // children: ReactNode
  workplaces: IWorkplace[];
  bookings: IBooking[];
  refreshBookings: Function;
  floorImage: string | null;
}