import { HTMLAttributes } from 'react';


export interface LeftPanelProps extends HTMLAttributes<HTMLDivElement> {
  isBurgerActive: boolean;
  setIsBurgerActive: Function;
}