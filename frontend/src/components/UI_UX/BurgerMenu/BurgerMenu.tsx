import styles from './BurgerMenu.module.scss';
import { BurgerMenuProps } from './BurgerMenu.props.ts';
import cn from 'classnames';


function BurgerMenu({className, isActive, ...props}: BurgerMenuProps) {
  
  return (
    <button className={cn('btn-reset', className, styles['burger'], {
      [styles['burger__active']]: isActive
    })} {...props}>
      <span className={styles['burger__line']}></span>
      <span className={styles['burger__line']}></span>
      <span className={styles['burger__line']}></span>
    </button>
  );
}


export default BurgerMenu;
