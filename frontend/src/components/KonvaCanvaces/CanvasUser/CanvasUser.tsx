import React, { useRef, useState, useEffect, useContext } from 'react';
import { Stage, Layer, Circle, Text } from 'react-konva';
import styles from './KonvaCanvas.module.scss';
import { IWorkplace } from '../../../networking/models/IWorkplace.ts';
import { IBooking } from '../../../networking/models/IBooking.ts';
import cn from 'classnames';
import { Context } from '../../../main.tsx';
import BookingService from '../../../networking/services/BookingService.ts';


// Интерфейс для рабочего места
// interface Workplace {
//   id: string;
//   x: number;
//   y: number;
//   number: string;
//   status: 'available' | 'reserved' | 'occupied';
// }


function CanvasUser({ workplaces, bookings }: { workplaces: IWorkplace[], bookings: IBooking[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [selectedPlace, setSelectedPlace] = useState<IWorkplace | null>(null);
  const [statusSelectedPlace, setStatusSelectedPlace] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { store } = useContext(Context);

  
  // Обновление размера холста при изменении размеров окна
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Обработчик клика по рабочему месту
  const handlePlaceClick = (workplace: IWorkplace) => {
    setSelectedPlace(workplace);
    setStatusSelectedPlace(getStatus(workplace));
  };
  
  // Обработчик клика вне рабочего места
  const handleStageClick = () => {
    setSelectedPlace(null);
  };
  
  // Получение цвета в зависимости от статуса
  const getColorByStatus = (place: IWorkplace) => {
    const status = getStatus(place);
    if (!status) {
      return '#4CAF50'; // Зеленый
    }
    switch (status) {
      case 'reserved': return '#FFC107';  // Желтый
      case 'occupied': return '#F44336';  // Красный
      default: return '#9E9E9E';          // Серый
    }
  };
  const getStatus = (place: IWorkplace) => {
    for (const book of bookings) {
      if (book.workplace_id == place?.id) {
        return book.status;
      }
    }
    return null;
  };
  
  const dateCreation = (value: string) => {
    // const startDate = new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' });
    const splitedDate: string[] = value.split('-');
    console.log(splitedDate);
    const date = new Date(Number(splitedDate[0]), Number(splitedDate[1]) - 1, Number(splitedDate[2])).toISOString();
    console.log(date);
    return date;
  };
  
  
  const reserve = async () => {
    console.log(store.user.id);
    if (!selectedPlace) return;
    const data: IBooking = {
      user_id: store.user.id as number,
      workplace_id: selectedPlace?.id,
      start_time: startDate,
      end_time: endDate,
      status: 'reserved'
    };
    const res = await BookingService.createBooking(data);
    console.log(res);
  };
  
  
  return (
    <div className={styles.konvaContainer} ref={containerRef}>
      {/* Холст с рабочими местами */}
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onClick={handleStageClick}
      >
        <Layer>
          {/* Рендерим рабочие места */}
          {workplaces.map((place) => (
            <React.Fragment key={place.id}>
              <Circle
                x={place.x}
                y={place.y}
                radius={30}
                fill={getColorByStatus(place)}
                // fill={'#4CAF50'}
                stroke={selectedPlace?.id === place.id ? '#2196F3' : '#FFF'}
                strokeWidth={selectedPlace?.id === place.id ? 3 : 1}
                onClick={(e) => {
                  e.cancelBubble = true; // Предотвращаем всплытие
                  handlePlaceClick(place);
                }}
                onTap={(e) => {
                  e.cancelBubble = true;
                  handlePlaceClick(place);
                }}
              />
              <Text
                x={place.x - 10}
                y={place.y - 8}
                text={place.title}
                fontSize={16}
                fill="#FFF"
                fontFamily="Arial, sans-serif"
                fontStyle="bold"
                onClick={(e) => {
                  e.cancelBubble = true;
                  handlePlaceClick(place);
                }}
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
      
      {/* Панель информации о выбранном месте */}
      {selectedPlace && (
        <div className={styles.infoPanel}>
          <div className={styles.infoHeader}>
            <h3>Рабочее место {selectedPlace.title}</h3>
            <div
              className={styles.statusIndicator}
              style={{ backgroundColor: getColorByStatus(selectedPlace) }}
            />
          </div>
          
          <div className={styles.infoContent}>
            <p>
              Статус: {statusSelectedPlace === null
              ? 'Доступно'
              : statusSelectedPlace === 'reserved'
                ? 'Забронировано'
                : 'Занято'}
            </p>
            {statusSelectedPlace === null &&
              <div>
                <input
                  className={cn(styles['date'], styles['date_start'])}
                  type="date"
                  onChange={(e) => setStartDate(dateCreation(e.target.value))}/>
                <input
                  className={cn(styles['date'], styles['date_end'])}
                  type="date"
                  onChange={(e) => setEndDate(dateCreation(e.target.value))}/>
              </div>
            }
            <button className={styles.reserveButton} onClick={reserve} disabled={statusSelectedPlace !== null}>
              {statusSelectedPlace === null
                ? 'Забронировать'
                : statusSelectedPlace === 'reserved' &&
                  /*? 'Отменить бронь'
                  :*/ 'Посмотреть детали'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


export default CanvasUser;




// // Пример данных рабочих мест
// const workplaces: Workplace[] = [
//   { id: '1', x: 100, y: 100, number: 'A1', status: 'available' },
//   { id: '2', x: 200, y: 100, number: 'A2', status: 'reserved' },
//   { id: '3', x: 300, y: 100, number: 'A3', status: 'occupied' },
//   { id: '4', x: 100, y: 200, number: 'B1', status: 'available' },
//   { id: '5', x: 200, y: 200, number: 'B2', status: 'available' },
//   { id: '6', x: 300, y: 200, number: 'B3', status: 'reserved' }
// ];