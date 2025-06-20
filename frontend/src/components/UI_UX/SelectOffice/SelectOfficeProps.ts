import { SelectHTMLAttributes } from 'react';
import { IOffice } from '../../../networking/models/IOffice.ts';


export interface SelectOfficeProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  placeholder: string;
  setFun?: Function;
  data?: IOffice[];
}