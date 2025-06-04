import { ReactNode, useContext } from 'react';
import { Context } from '../../main.tsx';
import { Navigate } from 'react-router';
import { observer } from 'mobx-react-lite';


const RequireAdminRole = observer(({ children }: { children: ReactNode }) => {
  const {store} = useContext(Context);
  // console.log(store, store.user.role);
  
  console.log(store.user.role);
  if (store.user.role !== 'ADMIN') {
    return <Navigate to="/" replace/>;
  }
  
  return children;
});


export default RequireAdminRole;
