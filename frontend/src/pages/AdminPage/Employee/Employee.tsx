import styles from './Employee.module.scss';
import SelectOffice from '../../../components/UI_UX/SelectOffice/SelectOffice.tsx';
import Button from '../../../components/UI_UX/Button/Button.tsx';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import cn from 'classnames';
import UsersService from '../../../networking/services/UsersService.ts';
import { useEffect, useState } from 'react';
import { IUser } from '../../../networking/models/IUser.ts';
import ModalBasis from '../../../components/Modals/ModalBasis/ModalBasis.tsx';
import CreateEmployee from '../../../components/Modals/CreateEmployee/CreateEmployee.tsx';


const offices = [
  {id: 1, name: 'ОФИС #1', address: 'Улица Пушкина, дом Калотушкина'},
  {id: 2, name: 'ОФИС #2', address: 'Улица Пушкина, дом Калотушкина'},
  {id: 3, name: 'ОФИС #3', address: 'Улица Пушкина, дом Калотушкина'},
  {id: 4, name: 'ОФИС #4', address: 'Улица Пушкина, дом Калотушкина'}
];


function Employee() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [editableNames, setEditableNames] = useState<Record<number, string>>({});
  const [activeModalCE, setActiveModalCE] = useState(false);
  
  const getAllUsers = async () => {
    const res = await UsersService.getAll();
    const usersData = res.data.sort((a: IUser, b: IUser) => a.id - b.id);
    
    const initialNames = usersData.reduce((acc: Record<number, string>, user: IUser) => {
      acc[user.id] = `${user.name} ${user.surname}`;
      return acc;
    }, {} as Record<number, string>);
    
    setEditableNames(initialNames);
    setUsers(usersData);
  };
  
  const handleNameChange = (id: number, value: string) => {
    setEditableNames(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const saveUserEdit = async (user: IUser) => {
    const newUserData = {
      ...user,
      name: editableNames[user.id].trim().split(' ')[0],
      surname: editableNames[user.id].trim().split(' ')[1]
    };
    
    const res = await UsersService.update(newUserData);
    console.log(res);
  };
  
  const deleteUser = async (id: number) => {
    const res = await UsersService.delete(id);
    console.log(res);
  };
  
  useEffect(() => {
    getAllUsers();
  }, []);
  
  return (
    <>
      <ModalBasis isActive={activeModalCE} setActive={setActiveModalCE}>
        <CreateEmployee setClose={setActiveModalCE} refresh={getAllUsers}/>
      </ModalBasis>
      
      <div className={styles['emp__actions']}>
        <SelectOffice data={offices} placeholder={'Выберите офис для настройки'}/>
        <Button className={styles['emp__add']} onClick={() => setActiveModalCE(true)}>
          Добавить сотрудника
          <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.80769 1.96154C9.80769 1.15312 9.22332 0.5 8.5 0.5C7.77668 0.5 7.19231 1.15312 7.19231 1.96154V8.53846H1.30769C0.584375 8.53846 0 9.19159 0 10C0 10.8084 0.584375 11.4615 1.30769 11.4615H7.19231V18.0385C7.19231 18.8469 7.77668 19.5 8.5 19.5C9.22332 19.5 9.80769 18.8469 9.80769 18.0385V11.4615H15.6923C16.4156 11.4615 17 10.8084 17 10C17 9.19159 16.4156 8.53846 15.6923 8.53846H9.80769V1.96154Z"
              fill="white"/>
          </svg>
        </Button>
      </div>
      
      <div className={cn(styles['emp__item'], styles['emp__head'])}>
        <h3 className={styles['emp__head-text']}>#</h3>
        <h3 className={styles['emp__head-text']}>ИФ</h3>
        <h3 className={styles['emp__head-text']}>Роль</h3>
        <h3 className={styles['emp__head-text']}>Офис</h3>
      </div>
      
      <OverlayScrollbarsComponent>
        <ul className={cn('list-reset', styles['emp__table'])}>
          {users && users.map((user: IUser) => (
              <li className={styles['emp__row']} key={user.id}>
                <div className={styles['emp__item']}>
                  <p className={styles['emp__item-text']}>{user.id}</p>
                  <input
                    className={cn(styles['emp__item-text'], styles['emp__item-text_name'])}
                    // value={user.name + user.surname}
                    name={`${user.id}`}
                    value={editableNames[user.id]}
                    onChange={(e) => handleNameChange(user.id, e.target.value)}
                    placeholder={'Имя Фамилия'}
                  />
                  <p className={styles['emp__item-text']}>{user.role}</p>
                  <p className={styles['emp__item-text']}>1</p>
                  <div className={styles['emp__item-actions']}>
                    <Button onClick={() => deleteUser(user.id)} className={styles['emp__item-del']}>
                      <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5.13036 0.671652L4.85714 1.21429H1.21429C0.542634 1.21429 0 1.75692 0 2.42857C0 3.10022 0.542634 3.64286 1.21429 3.64286H15.7857C16.4574 3.64286 17 3.10022 17 2.42857C17 1.75692 16.4574 1.21429 15.7857 1.21429H12.1429L11.8696 0.671652C11.6647 0.258036 11.2435 0 10.7844 0H6.21563C5.75647 0 5.33527 0.258036 5.13036 0.671652ZM15.7857 4.85714H1.21429L2.01875 17.721C2.07946 18.681 2.87634 19.4286 3.83638 19.4286H13.1636C14.1237 19.4286 14.9205 18.681 14.9812 17.721L15.7857 4.85714Z"
                          fill="white"/>
                      </svg>
                    </Button>
                    <Button onClick={() => saveUserEdit(user)}>
                      <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12.0557 0.696504L10.4469 2.49441L14.768 7.32351L16.3768 5.5256C17.2077 4.59693 17.2077 3.09248 16.3768 2.16381L15.0671 0.696504C14.2362 -0.232168 12.89 -0.232168 12.059 0.696504H12.0557ZM9.69567 3.33393L1.94759 11.9966C1.6019 12.3829 1.34928 12.8621 1.20968 13.3859L0.0330089 17.8547C-0.0500893 18.1704 0.0263611 18.5084 0.232445 18.7388C0.438528 18.9691 0.741006 19.0545 1.02022 18.9653L5.0189 17.6503C5.48757 17.4943 5.91636 17.212 6.26205 16.8257L14.0168 8.16303L9.69567 3.33393Z"
                          fill="white"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
      </OverlayScrollbarsComponent>
    </>
  );
}


export default Employee;
