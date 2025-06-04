import { HTMLAttributes, ReactNode } from 'react';


export interface EmployeeProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}