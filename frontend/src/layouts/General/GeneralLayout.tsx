import styles from './GeneralLayout.module.scss';
import { Outlet } from 'react-router';
import LeftPanel from '../../components/LeftPanel/LeftPanel.tsx';
import RightPanel from '../../components/RightPanel/RightPanel.tsx';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useEffect, useState } from 'react';


function GeneralLayout() {
  const [burgerActive, setBurgerActive] = useState(false);
  useEffect(() => {
    if (window.innerWidth > 800) {
      setBurgerActive(true);
    } else {
      setBurgerActive(false);
    }
  }, []);
  
  return (
    <div className={styles['layout-page']}>
      <div className={styles['layout']}>
        <LeftPanel isBurgerActive={burgerActive} setIsBurgerActive={setBurgerActive}/>
        <main className={styles['main']}>
          <OverlayScrollbarsComponent className={styles['scrollbar']} options={{ overflow: { x: 'hidden' } }}>
            <div className={styles['main__outlet']}>
              <Outlet/>
            </div>
          </OverlayScrollbarsComponent>
        </main>
        <RightPanel isBurgerActive={burgerActive}/>
      </div>
    </div>
  );
}


export default GeneralLayout;
