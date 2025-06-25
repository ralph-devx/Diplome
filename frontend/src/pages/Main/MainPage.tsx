import styles from './MainPage.module.scss';
import SelectOffice from '../../components/UI_UX/SelectOffice/SelectOffice.tsx';
import CanvasUser from '../../components/KonvaCanvaces/CanvasUser/CanvasUser.tsx';
import { useCallback, useEffect, useState } from 'react';
import OfficesService from '../../networking/services/OfficesService.ts';
import { IOffice } from '../../networking/models/IOffice.ts';
import { IWorkplace } from '../../networking/models/IWorkplace.ts';
import { IFloor } from '../../networking/models/IFloor.ts';
import BookingService from '../../networking/services/BookingService.ts';
import { IBooking } from '../../networking/models/IBooking.ts';
import cn from 'classnames';
import { BASE_URL } from '../../networking/http';
// import { API_URL } from '../../networking/http';


function MainPage() {
  const [selectedOffice, setSelectedOffice] = useState<number>(0 as number);
  const [offices, setOffices] = useState<IOffice[]>([]);
  const [floors, setFloors] = useState<IFloor[]>([]);
  const [workplaces, setWorkplaces] = useState<IWorkplace[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const [currentFloorImage, setCurrentFloorImage] = useState<string | null>(null);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  // const yamap = useRef(null);

  
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
  const getFloors = useCallback(async () => {
    if (!selectedOffice) return;
    const res = await OfficesService.getFloors(selectedOffice);
    console.log(res.data);
    setFloors(res.data.sort((a: IFloor, b: IFloor) => a.level - b.level));
    setWorkplaces([]);
  }, [selectedOffice]);
  useEffect(() => {
    if (selectedOffice) {
      getFloors();
    }
  }, [getFloors, selectedOffice, offices]);
  
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
        setFun={(id: number) => {
          setSelectedFloor(0);
          setCurrentFloorImage(null);
          setSelectedOffice(id);
        }}
        placeholder={'Выберите офис для настройки'}
      />

      <div className={styles['main-page__floors']}>
        {floors.map(floor => (
          <button className={cn('btn-reset', styles['main-page__floor'])} key={floor.id}
                  onClick={() => {
                    setCurrentFloorImage(floor.image || null);
                    setSelectedFloor(floor.id);
                  }}>{floor.level}</button>
        ))}
      </div>
      <CanvasUser workplaces={workplaces} floorImage={`${BASE_URL}static/${currentFloorImage}`} bookings={bookings}
                  refreshBookings={getBookings}/>
      {/*</div>*/}
    </>
  );
}

// image={floorImage}

export default MainPage;
