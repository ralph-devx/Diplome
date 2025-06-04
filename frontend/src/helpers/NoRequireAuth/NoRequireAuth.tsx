// import styles from './NoRequireAuth.module.scss';
import { ReactNode } from 'react';
// import { Context } from '../../main.tsx';
import { Navigate } from 'react-router';


function NoRequireAuth({ children }: { children: ReactNode }) {
  // const {store} = useContext(Context);
  
  if (localStorage.getItem('jwt')) {
    return <Navigate to="/" replace/>;
  }
  return children;
}


export default NoRequireAuth;
