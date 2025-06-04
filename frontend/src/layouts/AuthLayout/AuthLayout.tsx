import styles from './AuthLayout.module.scss';
import { Outlet } from 'react-router';
import cn from 'classnames';


function AuthLayout() {
  
  return (
    <div className={cn('layout-page', styles['auth-layout'])}>
      <div className={'layout'}>
        <main className={cn('main', styles['auth-layout__main'])}>
          <Outlet/>
        </main>
      </div>
    </div>
  );
}


export default AuthLayout;
