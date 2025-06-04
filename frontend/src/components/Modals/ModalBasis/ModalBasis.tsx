import styles from './ModalBasis.module.scss';
import cn from 'classnames';
import {ModalBasisProps} from './ModalBasis.props.ts';
import { useEffect, useState } from 'react';


function ModalBasis({ children, isActive, setActive }: ModalBasisProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      // Задержка для корректного запуска анимации
      requestAnimationFrame(() => setIsMounted(true));
      document.body.classList.add('modal-open');
    } else {
      setIsMounted(false);
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isActive]);
  
  if (!isActive) return null;
  
  // return (
  //   <div
  //     className={cn(styles['modal'], {
  //       [styles['modal_active']]: isActive
  //     })}
  //     onMouseDown={() => setActive(false)}>
  //     <div className={cn(styles['modal__content'], {
  //       [styles['modal__content_active']]: isActive
  //     })} onMouseDown={e => e.stopPropagation()}>
  //       {children}
  //     </div>
  //   </div>
  // );
  return (
    <div
      className={cn(styles['modal'], {
        [styles['modal_active']]: isMounted
      })}
      onMouseDown={() => setActive(false)}>
      <div
        className={cn(styles['modal__content'])}
        onMouseDown={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}


export default ModalBasis;
