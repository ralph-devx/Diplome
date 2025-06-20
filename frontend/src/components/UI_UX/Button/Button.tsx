import styles from './Button.module.scss';
import cn from 'classnames';
import { ForwardedRef, forwardRef } from 'react';
import { ButtonProps } from './Button.props.ts';


const Button = forwardRef(function Button({children, className, appearance, ...props}: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  
  return (
    // <button className={cn('btn-reset', styles['auth-page__submit'])} type={ 'button' }>Войти</button>
    <button
      ref={ref}
      {...props}
      className={cn('btn-reset', styles['button'], className, {
        [styles['button__red']]: appearance === 'red'
      })}
    >
      { children }
    </button>
  );
});


export default Button;
