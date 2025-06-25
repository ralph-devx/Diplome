import Button from '../../UI_UX/Button/Button.tsx';
import React, { useRef, useState, useEffect, useContext, useCallback } from 'react';
import { Stage, Layer, Circle, Text } from 'react-konva';
import styles from './CanvasUser.module.scss';
import { IWorkplace } from '../../../networking/models/IWorkplace.ts';
import { IBooking } from '../../../networking/models/IBooking.ts';
import cn from 'classnames';
import { Context } from '../../../main.tsx';
import BookingService from '../../../networking/services/BookingService.ts';
import { CanvasUserProps } from './CanvasUser.props.ts';
import UsersService from '../../../networking/services/UsersService.ts';
import { IUser } from '../../../networking/models/IUser.ts';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';


// Интерфейс для рабочего места
// interface Workplace {
//   id: string;
//   x: number;
//   y: number;
//   number: string;
//   status: 'available' | 'reserved' | 'occupied';
// }


interface Details {
  status: boolean,
  user: IUser | null,
  book: IBooking | null,
}


function CanvasUser({ workplaces, bookings, refreshBookings }: CanvasUserProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [selectedPlace, setSelectedPlace] = useState<IWorkplace | null>(null);
  const [statusSelectedPlace, setStatusSelectedPlace] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { store } = useContext(Context);
  const [statusShowDetails, setStatusShowDetails] = useState<Details>({status: false, user: null, book: null});
  // const [areDatesValid, setAreDatesValid] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  
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
  const handlePlaceClick = async (workplace: IWorkplace) => {
    setStartDate('');
    setEndDate('');
    setValidationError(null);
    setSelectedPlace(workplace);
    setStatusSelectedPlace(getStatus(workplace));
    const book = getBook(workplace);
    if (book) {
      const user = await UsersService.getUserById(book.user_id);
      if (user) {
        setStatusShowDetails({status: false, user: user.data, book});
      }
    } else {
      setStatusShowDetails((prev) => ({...prev, status: false}));
    }
  };
  
  // Обработчик клика вне рабочего места
  const handleStageClick = () => {
    setStatusShowDetails(prev => ({...prev, status: false}));
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
  const getBook = useCallback((place: IWorkplace) => {
    return bookings.find(book => book.workplace_id === place.id);
  }, [bookings]);
  
  // const dateCreation = (value: string) => {
  //   return value ? new Date(value).toISOString() : '';
  //   // if (value === '') return '';
  //   // const date = new Date(value).toISOString();
  //   // console.log(date);
  //   // return date;
  //   // const startDate = new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' });
  //   // const splitedDate: string[] = value.split('-');
  //   // new Date(Number(splitedDate[0]), Number(splitedDate[1]) - 1, Number(splitedDate[2])).toISOString();
  // };
  // Функция валидации дат
  const validateDates = (start: string, end: string): boolean => {
    if (!start || !end) {
      setValidationError('Пожалуйста, заполните обе даты');
      return false;
    }
    
    // const startDateObj = new Date(start).toISOString().split('T')[0];
    // const endDateObj = new Date(end).toISOString().split('T')[0];
    // const now = new Date().toISOString().split('T')[0];
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const now = new Date();
    
    // console.log(now.toDateString(), startDateObj.toDateString());
    if (startDateObj.getTime() < now.getTime()) {
      setValidationError('Дата/Время начала не может быть в прошлом');
      return false;
    }
    
    if (startDateObj.getTime() >= endDateObj.getTime()) {
      setValidationError('Дата/Время окончания должны быть позже даты начала');
      return false;
    }
    
    setValidationError(null);
    return true;
  };
  // Обновление валидации при изменении дат (наличие и их диапазон):
  useEffect(() => {
    if (startDate && endDate) {
      validateDates(startDate, endDate);
    } else {
      setValidationError(null);
    }
  }, [startDate, endDate]);
  
  // Автоматическое обновление минимального времени для конечной даты
  useEffect(() => {
    if (startDate) {
      const minEndDate = new Date(startDate);
      minEndDate.setMinutes(minEndDate.getMinutes() + 1);
      
      // Если конечная дата раньше новой минимальной, сбрасываем её
      if (endDate && new Date(endDate) < minEndDate) {
        setEndDate('');
        setValidationError('Выберите новое время окончания');
      }
    }
  }, [startDate]);
  
  // Функция для форматирования datetime-local значения
  const toDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  
  // бронирование
  const reserve = async () => {
    // if (!selectedPlace || !startDate || !endDate) return;
    if (!selectedPlace) return;
    // Проверяем валидность дат
    if (!validateDates(startDate, endDate)) return;
    const data: IBooking = {
      user_id: store.user.id as number,
      workplace_id: selectedPlace?.id,
      start_time: new Date(startDate).toISOString(),
      end_time: new Date(endDate).toISOString(),
      status: 'reserved'
    };
    const res = await BookingService.createBooking(data);
    console.log(res);
    await refreshBookings();
    setStatusSelectedPlace('reserved');
  };
  
  
  // const setDate = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = dateCreation(e.target.value);
  //   if (e.target.name === 'start') {
  //     setStartDate(value);
  //   } else {
  //     setEndDate(value);
  //   }
  // };
  
  
  const showDetails = async () => {
    if (statusShowDetails.status) {
      setStatusShowDetails(prev => ({...prev, status: false}));
      return;
    }
    if (!selectedPlace) return;
    const book = getBook(selectedPlace);
    if (!book) return;
    const user = await UsersService.getUserById(book.user_id);
    if (!user) return;
    setStatusShowDetails(prev => ({...prev, status: true, user: user.data, book}));
  };
  
  
  const cancelBook = async () => {
    if (!selectedPlace) return;
    if (!statusShowDetails.book || !statusShowDetails.book.id) return;
    await BookingService.deleteBook(statusShowDetails.book.id);
    setStatusSelectedPlace(null);
    setStatusShowDetails({status: false, user: null, book: null});
    refreshBookings();
  };
  
  
  return (
    <OverlayScrollbarsComponent>
      <div className={styles['konva']}>
        <div className={styles['konva__container']} ref={containerRef}>
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
                    radius={place.radius}
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
            <div className={styles['info-panel']}>
              <div className={styles['info-panel__header']}>
                <h3 className={styles['info-panel__title']}>Рабочее место {selectedPlace.title}</h3>
                <div
                  className={styles['status-indicator']}
                  style={{ backgroundColor: getColorByStatus(selectedPlace)}}
                />
              </div>
              
              <div className={styles['info-panel__content']}>
                <p className={styles['info-panel__status']}>
                  Статус: {statusSelectedPlace === null
                  ? 'Доступно'
                  : statusSelectedPlace === 'reserved'
                    ? 'Забронировано'
                    : 'Занято'}
                </p>
                {statusSelectedPlace === null &&
                  <div className={styles['info-panel__labels']}>
                    <div className={styles['info-panel__label']}>
                      Начало:
                      <input
                        className={cn(styles['date'], styles['date_start'])}
                        type="datetime-local"
                        name={'start'}
                        value={startDate}
                        min={toDateTimeLocal(new Date())}
                        // onChange={(e) => setStartDate(dateCreation(e.target.value))}/>
                        onChange={(e) => setStartDate(e.target.value)}/>
                    </div>
                    <div className={styles['info-panel__label']}>
                      Конец:
                      <input
                        className={cn(styles['date'], styles['date_end'])}
                        type="datetime-local"
                        name={'end'}
                        value={endDate}
                        min={startDate || toDateTimeLocal(new Date())}
                        // onChange={(e) => setEndDate(dateCreation(e.target.value))}/>
                        onChange={(e) => setEndDate(e.target.value)}/>
                    </div>
                    {validationError && (
                      <p className={styles['info-panel__error']}>
                        {validationError}
                      </p>
                    )}
                  </div>
                }
                {statusShowDetails.status && <div className={styles['info-panel__details']}>
                  <h4 className={styles['info-panel__details-fio']}>{statusShowDetails.user?.name + ' ' + statusShowDetails.user?.surname}</h4>
                  <p className={styles['info-panel__details-period']}>
                    {/*{statusShowDetails.book?.start_time.split('T')[0] + ' — ' + statusShowDetails.book?.end_time.split('T')[0]}*/}
                    {statusShowDetails.book && new Date(statusShowDetails.book?.start_time).toLocaleString()}
                  </p>
                  <p className={styles['info-panel__details-period']}>
                    {statusShowDetails.book && new Date(statusShowDetails.book?.end_time).toLocaleString()}
                  </p>
                </div>}
                <Button
                  className={styles['info-panel__reservebtn']}
                  onClick={statusSelectedPlace === null ? reserve : showDetails}
                  // disabled={statusSelectedPlace === null ? !areDatesValid : false}
                  disabled={statusSelectedPlace === null ? !startDate || !endDate || !!validationError : false}
                >
                  {statusSelectedPlace === null
                    ? 'Забронировать'
                    : 'Посмотреть детали'
                  }
                </Button>
                {getBook(selectedPlace)?.user_id === store.user.id && (
                  <Button className={styles['info-panel__cancel']} onClick={cancelBook} appearance={'red'}>
                    Отменить бронь
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </OverlayScrollbarsComponent>
  );
}


export default CanvasUser;
