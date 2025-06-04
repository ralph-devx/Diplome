import { SelectHTMLAttributes } from 'react';


export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  placeholder: string;
  setFun?: Function;
  data?: {
    id: number,
    text: string
  }[];
}