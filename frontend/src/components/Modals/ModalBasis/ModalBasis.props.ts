import { HTMLAttributes, ReactNode } from 'react';


export interface ModalBasisProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  isActive: boolean,
  setActive: Function
}