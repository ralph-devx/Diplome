import { ReactNode, useContext } from 'react';
import { Context } from '../../main.tsx';
import { Navigate } from 'react-router';
import { observer } from 'mobx-react-lite';


const RequireAuth = observer(({children}: { children: ReactNode }) => {
  const {store} = useContext(Context);
  
  if (!localStorage.getItem('jwt')) {
    return <Navigate to="/auth" replace/>;
  }
  
  store.checkAuth().then(r => {
    if (!r) {
      localStorage.removeItem('jwt');
    }
  });
  
  if (!localStorage.getItem('jwt')) {
    return <Navigate to="/auth" replace/>;
  }
  
  return children;
});


export default RequireAuth;
