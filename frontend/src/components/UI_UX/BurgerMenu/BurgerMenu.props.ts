import { ButtonHTMLAttributes } from 'react';


export interface BurgerMenuProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  isActive: boolean
}