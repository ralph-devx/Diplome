import styles from './GeneralLayout.module.scss';
import { Outlet } from 'react-router';
import LeftPanel from '../../components/LeftPanel/LeftPanel.tsx';
import RightPanel from '../../components/RightPanel/RightPanel.tsx';


function GeneralLayout() {
  
  return (
    <div className={styles['layout-page']}>
      <div className={styles['layout']}>
        <LeftPanel/>
        <main className={styles['main']}>
          <Outlet/>
        </main>
        <RightPanel/>
      </div>
    </div>
  );
}


export default GeneralLayout;
