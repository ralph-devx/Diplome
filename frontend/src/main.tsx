import { createContext, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'overlayscrollbars/styles/overlayscrollbars.css';
import './normalize.css';
import './index.scss';
import { RouterProvider } from 'react-router/dom';
import { createBrowserRouter } from 'react-router';
import GeneralLayout from './layouts/General/GeneralLayout.tsx';
import MainPage from './pages/Main/MainPage.tsx';
import AuthLayout from './layouts/AuthLayout/AuthLayout.tsx';
import AuthPage from './pages/AuthPage/AuthPage.tsx';
import Store from './store/store.ts';
import RequireAuth from './helpers/RequireAuth/RequireAuth.tsx';
import NoRequireAuth from './helpers/NoRequireAuth/NoRequireAuth.tsx';
import AdminPage from './pages/AdminPage/AdminPage.tsx';
import RequireAdminRole from './helpers/RequireAdminRole/RequireAdminRole.tsx';
import Employee from './pages/AdminPage/Employee/Employee.tsx';
import Offices from './pages/AdminPage/Offices/Offices.tsx';


interface State {
  store: Store
}

const store = new Store();
export const Context = createContext<State>({
  store
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <RequireAuth><GeneralLayout/></RequireAuth>,
    children: [
      {
        path: '/',
        element: <RequireAuth><MainPage/></RequireAuth>
      },
      {
        path: 'mybooking'
      },
      {
        path: '/admin',
        element: <RequireAdminRole><AdminPage/></RequireAdminRole>,
        children: [
          {
            path: 'employee',
            element: <Employee/>
          },
          {
            path: 'offices',
            element: <Offices/>
          }
        ]
      }
    ]
  },
  {
    path: '/auth',
    element: <NoRequireAuth><AuthLayout/></NoRequireAuth>,
    children: [
      {
        path: '/auth',
        element: <AuthPage/>
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <Context.Provider value={{ store }}>
    <StrictMode>
      <RouterProvider router={router}/>
    </StrictMode>
  </Context.Provider>
);
