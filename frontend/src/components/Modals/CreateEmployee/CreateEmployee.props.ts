import { HTMLAttributes } from 'react';


export interface CreateEmployeeProps extends HTMLAttributes<HTMLDivElement> {
  // setData: Function
  setClose: Function
  refresh: Function
}