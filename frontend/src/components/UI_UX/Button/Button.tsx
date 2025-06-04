import styles from './Button.module.scss';
import cn from 'classnames';
import { ButtonProps } from './Button.props.ts';


function Button({children, className, appearance, ...props}: ButtonProps) {
  
  return (
    // <button className={cn('btn-reset', styles['auth-page__submit'])} type={ 'button' }>Войти</button>
    <button className={cn('btn-reset', styles['button'], className)} {...props}>{ children }</button>
  );
}


export default Button;
