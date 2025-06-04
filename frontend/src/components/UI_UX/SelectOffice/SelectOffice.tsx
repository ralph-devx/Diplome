import styles from './DoubleSelect.module.scss';
import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { DoubleSelectProps } from './DoubleSelectProps.ts';
import { IOffice } from '../../../networking/models/IOffice.ts';


function SelectOffice({ className, placeholder, setFun, data }: DoubleSelectProps) {
  const [openOrClose, setOpenOrClose] = useState(false);
  const [currentSelectedItem, setCurrentSelectedItem] = useState<HTMLButtonElement | null>(null);
  const $selectElement = useRef<HTMLDivElement>(null);
  const [curPlaceholder, setCurPlaceholder] = useState(placeholder);

  const openCloseContent = () => {
    if (openOrClose) setOpenOrClose(false);
    else setOpenOrClose(true);
  };
  
  const selectItem = (e: React.MouseEvent<HTMLButtonElement>, el: IOffice) => {
    if (currentSelectedItem === e.currentTarget) return;
    if (currentSelectedItem !== null) {
      currentSelectedItem.classList.remove(styles['select__item_active']);
    }
    e.currentTarget.classList.add(styles['select__item_active']);
    if (setFun) {
      console.log(el);
      setFun(el.id);
    }
    setCurPlaceholder(el.name);
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
      styles['select'], {
        [styles['select_active']]: openOrClose
      }, className)}>
      <button onClick={openCloseContent}
              className={cn('btn-reset', styles['select__title'], 'fha-btn2')}>{curPlaceholder}</button>
      <ul className={cn(
        'list-reset',
        styles['select__list'], {
          [styles['select__list_active']]: openOrClose
        })}>
        {
          data
            ? data.map(el => (
              <li key={el.id} className={styles['select__item']}>
                <button className={cn('btn-reset', styles['select__item-text'], 'fha-btn2')} onClick={(e) => selectItem(e, el)}>
                  <span className={styles['select__item-text-span']}>{el.name}</span>
                  {el.address}
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


export default SelectOffice;
