import styles from './Input.module.scss';
import cn from 'classnames';
import { InputProps } from './Input.props.ts';


function Input({className, type, ...props}: InputProps) {
  
  return (
    <input
      className={cn(styles['input'], className)}
      type={type ? type : 'text'}
      placeholder={'Введите логин'}
      {...props}
    />
  );
}


export default Input;
