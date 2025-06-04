import styles from './LeftPanel.module.scss';
import IqnixLogo from '/src/assets/logo.png';
import cn from 'classnames';
import { NavLink } from 'react-router';
import { useContext } from 'react';
import { Context } from '../../main.tsx';
import { observer } from 'mobx-react-lite';


const LeftPanel = observer(()  => {
  const { store } = useContext(Context);
  
  return (
    <header className={styles['left-panel']}>
      <div className={styles['left-panel__container']}>
        <img className={styles['left-panel__logo']} src={IqnixLogo} alt="логотип iqnix"/>
        <nav className={styles['left-panel__nav']}>
          <NavLink className={({ isActive }) => cn(styles['left-panel__btn'], {
            [styles['left-panel__btn_active']]: isActive
          })} to={'/booking'}>
            <span className={styles['left-panel__btn-content']}>
              <svg className={styles['left-panel__btn-icon']} viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg">
                <path className={styles['left-panel__btn-icon-fill']}
                      d="M6.10714 5.34375V7.125H12.8929V5.34375C12.8929 3.70352 11.3746 2.375 9.5 2.375C7.62545 2.375 6.10714 3.70352 6.10714 5.34375ZM3.39286 7.125V5.34375C3.39286 2.39355 6.12835 0 9.5 0C12.8717 0 15.6071 2.39355 15.6071 5.34375V7.125H16.2857C17.7828 7.125 19 8.19004 19 9.5V16.625C19 17.935 17.7828 19 16.2857 19H2.71429C1.21719 19 0 17.935 0 16.625V9.5C0 8.19004 1.21719 7.125 2.71429 7.125H3.39286Z"
                />
              </svg>
              Бронирование
            </span>
          </NavLink>
          <NavLink className={({ isActive }) => cn(styles['left-panel__btn'], {
            [styles['left-panel__btn_active']]: isActive
          })} to={'/mybooking'}>
            <span className={styles['left-panel__btn-content']}>
              <svg className={styles['left-panel__btn-icon']} viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg">
                <path className={styles['left-panel__btn-icon-fill']}
                      d="M18.6024 0.556554C19.1325 1.29863 19.1325 2.50375 18.6024 3.24582L7.74651 18.4434C7.21644 19.1855 6.3556 19.1855 5.82552 18.4434L0.397556 10.8446C-0.132519 10.1026 -0.132519 8.89744 0.397556 8.15537C0.927631 7.41329 1.78847 7.41329 2.31855 8.15537L6.78814 14.4066L16.6857 0.556554C17.2158 -0.185518 18.0766 -0.185518 18.6067 0.556554H18.6024Z"
                />
              </svg>
              Моя бронь
            </span>
          </NavLink>
          {store.user.role === 'ADMIN' && <NavLink className={({isActive}) => cn(styles['left-panel__btn'], {
            [styles['left-panel__btn_active']]: isActive
          })} to={'/admin'}>
            <span className={styles['left-panel__btn-content']}>
              <svg className={styles['left-panel__btn-icon']} viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg">
                <path className={styles['left-panel__btn-icon-fill']}
                      d="M4.07143 4.75C4.07143 6.00978 4.64337 7.21796 5.66142 8.10876C6.67947 8.99956 8.06025 9.5 9.5 9.5C10.9397 9.5 12.3205 8.99956 13.3386 8.10876C14.3566 7.21796 14.9286 6.00978 14.9286 4.75C14.9286 3.49022 14.3566 2.28204 13.3386 1.39124C12.3205 0.500445 10.9397 0 9.5 0C8.06025 0 6.67947 0.500445 5.66142 1.39124C4.64337 2.28204 4.07143 3.49022 4.07143 4.75ZM8.07924 12.1793L8.86808 13.3297L7.4558 17.9275L5.92902 12.4762C5.8442 12.1756 5.51339 11.9789 5.16987 12.0568C2.20112 12.7063 0 15.059 0 17.8607C0 18.4916 0.585268 19 1.30201 19H6.8875C6.8875 19 6.8875 19 6.89174 19H7.125H11.875H12.1083C12.1083 19 12.1083 19 12.1125 19H17.698C18.419 19 19 18.4879 19 17.8607C19 15.059 16.7989 12.7063 13.8301 12.0568C13.4866 11.9826 13.1558 12.1793 13.071 12.4762L11.5442 17.9275L10.1319 13.3297L10.9208 12.1793C11.1922 11.7822 10.8656 11.2812 10.3397 11.2812H9.5H8.66451C8.13862 11.2812 7.81205 11.7859 8.08348 12.1793H8.07924Z"
                />
              </svg>
              Админ
            </span>
          </NavLink>}
        </nav>
      </div>
    </header>
  );
});


export default LeftPanel;
