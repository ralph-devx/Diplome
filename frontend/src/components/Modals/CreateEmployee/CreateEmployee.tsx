import styles from './CreateEmployee.module.scss';
import Input from '../../UI_UX/Input/Input.tsx';
import Button from '../../UI_UX/Button/Button.tsx';
import { CreateEmployeeProps } from './CreateEmployee.props.ts';
import Select from '../../UI_UX/Select/Select.tsx';
import { useContext, useState } from 'react';
import { Context } from '../../../main.tsx';
import UsersService from '../../../networking/services/UsersService.ts';
import { ICreateUsers } from '../../../networking/models/IUser.ts';


function CreateEmployee({ setClose, refresh }: CreateEmployeeProps) {
  const { store } = useContext(Context);
  const [selectedRole, setSelectedRole] = useState('');

  
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formProps = Object.fromEntries(formData);
    const data: ICreateUsers = {
      login: formProps.login as string,
      name:  formProps.name as string,
      password:  formProps.password as string,
      surname:  formProps.surname as string,
      role: selectedRole
    };
    const res = await UsersService.create(data);
    if (res.status === 201) {
      refresh();
    }
    setClose(false);
  };
  
  
  return (
    <>
      <h2 className={styles['ce__title']}>Новый сотрудник</h2>
      <div className={styles['ce__selects']}>
        <Select placeholder={'Выберите роль'} data={store.ROLES} setFun={setSelectedRole}/>
        {selectedRole === 'MANAGER' && <Select placeholder={'Выберите офис'}/>}
      </div>
      <form className={styles['ce__form']} action="#" onSubmit={submit}>
        <Input name={'name'} placeholder={'Введите имя'}/>
        <Input name={'surname'} placeholder={'Введите фамилию'}/>
        <Input name={'login'} placeholder={'Введите логин'}/>
        <Input name={'password'} placeholder={'Введите пароль'}/>
        <div className={styles['ce__actions']}>
          <Button className={styles['ce__cancel']} onClick={() => setClose(false)} type={'button'}>Отменить</Button>
          <Button type={'submit'}>Добавить</Button>
        </div>
      </form>
    </>
  );
}


export default CreateEmployee;