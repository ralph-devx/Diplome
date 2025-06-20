import { HTMLAttributes } from 'react';
import { IOffice } from '../../../networking/models/IOffice.ts';


export interface EditOfficesProps extends HTMLAttributes<HTMLDivElement> {
  // setData: Function
  setClose: Function
  refresh: Function
  offices: IOffice[]
}