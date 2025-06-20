import Button from '../../components/UI_UX/Button/Button.tsx';
import styles from './AuthPage.module.scss';
import cn from 'classnames';
import Input from '../../components/UI_UX/Input/Input.tsx';
import { FormEvent, useContext, useState } from 'react';
// import AuthService from '../../networking/services/AuthService.ts';
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';
import { Context } from '../../main.tsx';
import { observer } from 'mobx-react-lite';
import Logo from '/src/assets/logo.png';


export type LoginForm = {
  login: {
    value: string;
  };
  password: {
    value: string;
  };
}


function AuthPage() {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const {store} = useContext(Context);
  
  // const auth = async () => {
  //   console.log(login, password);
  //   try {
  //     const response = await AuthService.login(login, password);
  //     console.log(response);
  //     localStorage.setItem('jwt', JSON.stringify(response.data.token));
  //     navigate('/');
  //   } catch (e) {
  //     if (e instanceof AxiosError) {
  //       console.log(e.response?.data?.message);
  //     }
  //   }
  // };
  
  const authSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // console.log(e.target);
    // const target = e.target as typeof e.target & LoginForm;
    // const { login, password } = target;
    
    try {
      const log = await store.login(login, password);
      if (log) {
        navigate('/');
      }
      throw Error('Not logged in');
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e.response?.data?.message);
      }
    }
  };
  
  return (
    <section className={styles['auth-page']}>
      <div className={cn('container', styles['auth-page__container'])}>
        <div className={styles['auth-page__content']}>
          <img className={styles['auth-page__logo']} src={Logo} alt="логотип doffice"/>
          <h2 className={styles['auth-page__content-title']}>Вход в аккаунт</h2>
          <form className={styles['auth-page__form']} onSubmit={authSubmit}>
            <h3 className={styles['auth-page__label']}>Логин</h3>
            <Input
              className={styles['auth-page__input']}
              onChange={e => setLogin(e.currentTarget.value)}
              value={login}
              name={'login'}
              placeholder={'Введите логин'}
            />
            <h3 className={styles['auth-page__label']}>Пароль</h3>
            <Input
              className={styles['auth-page__input']}
              onChange={e => setPassword(e.currentTarget.value)}
              value={password}
              name={'password'}
              placeholder={'Введите пароль'}
            />
{/*            <div className={styles['auth-page__bottom']}>
              <label className={styles['auth-page__reme']} htmlFor="auth-page__checkbox">
                <input id={'auth-page__checkbox'} type="checkbox"/>
                <p className={styles['auth-page__reme-text']}>Запомнить меня</p>
              </label>
              <a className={styles['auth-page__forget']} href="#">Забыли пароль?</a>
            </div>*/}
            <Button className={styles['auth-page__submit']} type={'submit'}>Войти</Button>
          </form>
        </div>
        <h1 className={styles['auth-page__title']}>
          DO
          <span className={styles['auth-page__title-br']}>OFFICE</span>
        </h1>
      </div>
    </section>
  );
}


export default observer(AuthPage);
