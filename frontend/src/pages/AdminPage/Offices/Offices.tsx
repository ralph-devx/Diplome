import styles from './Offices.module.scss';


import Input from '../../../components/UI_UX/Input/Input.tsx';
import Button from '../../../components/UI_UX/Button/Button.tsx';
import OfficesService from '../../../networking/services/OfficesService.ts';
import { ICreateWorkplace } from '../../../networking/models/IWorkplace.ts';
import { ICreateFloor } from '../../../networking/models/IFloor.ts';
import { ICreateOffice } from '../../../networking/models/IOffice.ts';


function Offices() {
  
  const createOffice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formProps = Object.fromEntries(formData);
    const data: ICreateOffice = {
      name: formProps.name as string,
      address: formProps.address as string
    };
    const res = await OfficesService.createOffice(data);
    console.log(res);
  };
  
  const createFloor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formProps = Object.fromEntries(formData);
    const data: ICreateFloor = {
      office_id: Number(formProps.office_id) as number,
      level: Number(formProps.level) as number
    };
    const res = await OfficesService.createFloor(data);
    console.log(res);
  };
  
  const createWorkplace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formProps = Object.fromEntries(formData);
    const data: ICreateWorkplace = {
      floor_id: Number(formProps.floor_id) as number,
      title: formProps.title as string,
      x: Number(formProps.x) as number,
      y: Number(formProps.y) as number
    };
    const res = await OfficesService.createWorkplace(data);
    console.log(res);
  };
  
  return (
    <>
      <div className={styles['offices__crof']}>
        <h2 className={styles['offices__subtitle']}>Создание офиса</h2>
        <form className={styles['offices__form']} action="#" onSubmit={createOffice}>
          <Input name={'name'} placeholder={'Название'}/>
          <Input name={'address'} placeholder={'Адрес'}/>
          <Button type={'submit'}>Создать</Button>
        </form>
      </div>
      
      <div className={styles['offices__crof']}>
        <h2 className={styles['offices__subtitle']}>Создание этажа офиса</h2>
        <form className={styles['offices__form']} action="#" onSubmit={createFloor}>
          <Input name={'office_id'} placeholder={'ID офиса'}/>
          <Input name={'level'} placeholder={'Уровень этажа'}/>
          <Button type={'submit'}>Создать</Button>
        </form>
      </div>
      
      <div className={styles['offices__crof']}>
        <h2 className={styles['offices__subtitle']}>Создание рабочего места</h2>
        <form className={styles['offices__form']} action="#" onSubmit={createWorkplace}>
          <Input name={'floor_id'} placeholder={'ID этажа'}/>
          <Input name={'title'} placeholder={'Нажвание рабочего места'}/>
          <Input name={'x'} placeholder={'Расположение по горизонтали'}/>
          <Input name={'y'} placeholder={'Расположение по вертикали'}/>
          <Button type={'submit'}>Создать</Button>
        </form>
      </div>
    </>
  );
}


export default Offices;
