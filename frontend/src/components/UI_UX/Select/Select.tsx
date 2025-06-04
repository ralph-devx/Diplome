import styles from './Select.module.scss';
import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { SelectProps } from './Select.props.ts';


function Select({ className, placeholder, setFun, data }: SelectProps) {
  const [openOrClose, setOpenOrClose] = useState(false);
  const [currentSelectedItem, setCurrentSelectedItem] = useState<HTMLButtonElement | null>(null);
  const $selectElement = useRef<HTMLDivElement>(null);
  const [curPlaceholder, setCurPlaceholder] = useState(placeholder);
  
  const openCloseContent = () => {
    if (openOrClose) setOpenOrClose(false);
    else setOpenOrClose(true);
  };
  
  const selectItem = (e: React.MouseEvent<HTMLButtonElement>, el: {id: number, text: string}) => {
    if (currentSelectedItem === e.currentTarget) return;
    if (currentSelectedItem !== null) {
      currentSelectedItem.classList.remove(styles['select__item_active']);
    }
    e.currentTarget.classList.add(styles['select__item_active']);
    if (setFun) {
      setFun(el.text);
    }
    setCurPlaceholder(el.text);
    setCurrentSelectedItem(e.currentTarget);
  };

  
  const handleClick = (e: MouseEvent) => {
    if ($selectElement.current && !$selectElement.current.contains(e.target as HTMLElement)) {
      setOpenOrClose(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
  
  return (
    <div ref={$selectElement} className={cn(
      styles['select'],
      openOrClose ? styles['select_active'] : '',
      className)}>
      <button onClick={openCloseContent}
              className={cn('btn-reset', styles['select__title'], 'fha-btn2')}>{curPlaceholder}</button>
      <ul className={cn(
        'list-reset',
        styles['select__list'],
        openOrClose ? styles['select__list_active'] : ''
      )}>
        {
          data
            ? data.map(el => (
              <li key={el.id} className={styles['select__item']}>
                <button className={cn('btn-reset', styles['select__item-text'], 'fha-btn2')} onClick={(e) => selectItem(e, el)}>
                  {el.text}
                </button>
              </li>
            ))
            : <li className={styles['select__item']}>
              <button className={cn('btn-reset', styles['select__item-text'], 'fha-btn2')} disabled>
                пусто
              </button>
            </li>
        }
      </ul>
    </div>
  );
}


export default Select;
