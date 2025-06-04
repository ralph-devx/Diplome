import SelectOffice from '../../components/UI_UX/SelectOffice/SelectOffice.tsx';
import styles from './MainPage.module.scss';
import CanvasUser from '../../components/KonvaCanvaces/CanvasUser/CanvasUser.tsx';
import { useEffect, useState } from 'react';
import OfficesService from '../../networking/services/OfficesService.ts';
import { IOffice } from '../../networking/models/IOffice.ts';
import { IWorkplace } from '../../networking/models/IWorkplace.ts';
import { IFloor } from '../../networking/models/IFloor.ts';
import BookingService from '../../networking/services/BookingService.ts';
import { IBooking } from '../../networking/models/IBooking.ts';


function MainPage() {
  const [selectedOffice, setSelectedOffice] = useState<number>(0 as number);
  const [offices, setOffices] = useState<IOffice[]>([]);
  const [floors, setFloors] = useState<IFloor[]>([]);
  const [workplaces, setWorkplaces] = useState<IWorkplace[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const [bookings, setBookings] = useState<IBooking[]>([]);

  
  // подгрузка оффисов
  const fetchOffices = async () => {
    try {
      const res = await OfficesService.getOfficesOnly();
      setOffices(res.data.sort((a: IOffice, b: IOffice) => a.id - b.id));
    } catch (e) {
      console.error(e);
      return;
    }
  };
  useEffect(() => {
    fetchOffices();
  }, []);
  
  // подгрузка этажей в зависимости от выбранного офиса
  const getFloors = async () => {
    const res = await OfficesService.getFloors(selectedOffice);
    setFloors(res.data.sort((a: IFloor, b: IFloor) => a.level - b.level));
  };
  useEffect(() => {
    getFloors();
  }, [selectedOffice]);
  
  // подгрузка рабочих мест
  const choiceFloor = async () => {
    const res = await OfficesService.getWorkplaces(selectedFloor);
    setWorkplaces(res.data);
  };
  
  useEffect(() => {
    choiceFloor();
  }, [selectedFloor]);
  
  
  const getBookings = async () => {
    const res = await BookingService.getNotIncludeBookings();
    console.log(res.data);
    setBookings(res.data);
  };
  useEffect(() => {
    getBookings();
  }, []);
  
  
  return (
    <>
      <SelectOffice
        className={styles['main-page__select-office']}
        data={offices}
        setFun={setSelectedOffice}
        placeholder={'Выберите офис для настройки'}
      />
      {/*<div className={styles['main-page__content']}>*/}
        <div className={styles['main-page__floors']}>
          {floors.map(floor => (
            <button key={floor.id} onClick={() => setSelectedFloor(floor.id)}>Этаж {floor.level}</button>
          ))}
        </div>
        <CanvasUser workplaces={workplaces} bookings={bookings} />
      {/*</div>*/}
    </>
  );
}


export default MainPage;
