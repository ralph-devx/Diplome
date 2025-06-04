import styles from './AdminPage.module.scss';
// import cn from 'classnames';
import { NavLink, Outlet } from 'react-router';


function AdminPage() {
  
  return (
    <>
      <div className={styles['admin__tabs']}>
        <NavLink className={styles['admin__tab']} to={'offices'}>Настройка офисов и мест</NavLink>
        <NavLink className={styles['admin__tab']} to={'employee'}>Настройка персонала</NavLink>
      </div>
      <Outlet/>
    </>
  );
}


export default AdminPage;
