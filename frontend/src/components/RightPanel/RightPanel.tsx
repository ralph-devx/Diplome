import styles from './RightPanel.module.scss';
import userImg from '../../assets/user-img.jpg';
import cn from 'classnames';
import { useContext } from 'react';
import { Context } from '../../main.tsx';
import { useNavigate } from 'react-router';

function RightPanel() {
  const {store} = useContext(Context);
  const navigation = useNavigate();
  
  const logout = () => {
    localStorage.removeItem('jwt');
    store.isAuth = false;
    navigation('/auth');
  };
  
  return (
    <div className={styles['rp']}>
      <button className={cn('btn-reset', styles['rp__exit'])}>
        <img className={styles['rp__img']} src={userImg} alt="изображение сотрудника"/>
      </button>
      <button className={cn('btn-reset', styles['rp__exit'])} onClick={logout}>
        <svg className={styles['rp__exit-svg']} viewBox="0 0 28 25" xmlns="http://www.w3.org/2000/svg">
          <path className={styles['rp__exit-svg-path']}
            d="M20.6664 4.12388L27.382 10.9766C27.7758 11.3783 28 11.9308 28 12.5C28 13.0692 27.7758 13.6217 27.382 14.0234L20.6664 20.8761C20.3164 21.2333 19.8461 21.4286 19.3539 21.4286C18.3313 21.4286 17.5 20.5804 17.5 19.5368V16.0714H10.5C9.53203 16.0714 8.75 15.2734 8.75 14.2857V10.7143C8.75 9.72656 9.53203 8.92857 10.5 8.92857H17.5V5.46317C17.5 4.41964 18.3313 3.57143 19.3539 3.57143C19.8461 3.57143 20.3164 3.77232 20.6664 4.12388ZM8.75 3.57143H5.25C4.28203 3.57143 3.5 4.36942 3.5 5.35714V19.6429C3.5 20.6306 4.28203 21.4286 5.25 21.4286H8.75C9.71797 21.4286 10.5 22.2266 10.5 23.2143C10.5 24.202 9.71797 25 8.75 25H5.25C2.35156 25 0 22.6004 0 19.6429V5.35714C0 2.39955 2.35156 0 5.25 0H8.75C9.71797 0 10.5 0.797991 10.5 1.78571C10.5 2.77344 9.71797 3.57143 8.75 3.57143Z"/>
        </svg>
      </button>
    </div>
  );
}


export default RightPanel;
