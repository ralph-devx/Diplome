import Button from '../../UI_UX/Button/Button.tsx';
import React, { useRef, useState, useEffect, useContext, useCallback } from 'react';
import { Stage, Layer, Circle, Text, Image } from 'react-konva';
import styles from './CanvasUser.module.scss';
import { IWorkplace } from '../../../networking/models/IWorkplace.ts';
import { IBooking } from '../../../networking/models/IBooking.ts';
import cn from 'classnames';
import { Context } from '../../../main.tsx';
import BookingService from '../../../networking/services/BookingService.ts';
import { CanvasUserProps } from './CanvasUser.props.ts';
import UsersService from '../../../networking/services/UsersService.ts';
import { IUser } from '../../../networking/models/IUser.ts';
import useImage from 'use-image';
// import officeImage from '../../../assets/office-plan2.jpg';
import Konva from 'konva';

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

window.Konva = Konva;
window.Konva.hitOnDragEnabled = true;

// window.Konva.hitOnDragEnabled = true;

function CanvasUser({ workplaces, bookings, refreshBookings, floorImage }: CanvasUserProps) {
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
  
  // Добавляем состояние для масштабирования и перемещения
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [image] = useImage(floorImage || '');
  
  // для мобильного масштабирования
  const [lastCenter, setLastCenter] = useState<{ x: number; y: number } | null>(null);
  const [lastDist, setLastDist] = useState(0);
  const [dragStopped, setDragStopped] = useState(false);
  
  const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };
  
  const getCenter = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  };
  
  const handleTouchMove = useCallback((e: Konva.KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];
    const stage = e.target.getStage();
    if (!stage) return;
    
    // Восстановление перетаскивания при одном касании
    if (touch1 && !touch2 && !stage.isDragging() && dragStopped) {
      stage.startDrag();
      setDragStopped(false);
    }
    
    if (touch1 && touch2) {
      // Остановка перетаскивания при мультитаче
      if (stage.isDragging()) {
        stage.stopDrag();
        setDragStopped(true);
      }
      
      const p1 = { x: touch1.clientX, y: touch1.clientY };
      const p2 = { x: touch2.clientX, y: touch2.clientY };
      
      if (!lastCenter) {
        setLastCenter(getCenter(p1, p2));
        return;
      }
      
      const newCenter = getCenter(p1, p2);
      const dist = getDistance(p1, p2);
      
      if (!lastDist) {
        setLastDist(dist);
        return;
      }
      
      // Вычисление точки в локальных координатах
      const pointTo = {
        x: (newCenter.x - stagePosition.x) / stageScale,
        y: (newCenter.y - stagePosition.y) / stageScale
      };
      
      // Расчет нового масштаба
      const newScale = stageScale * (dist / lastDist);
      const clampedScale = Math.max(0.1, Math.min(5, newScale));
      
      // Расчет смещения
      const dx = newCenter.x - lastCenter.x;
      const dy = newCenter.y - lastCenter.y;
      
      // Новая позиция
      const newPos = {
        x: newCenter.x - pointTo.x * clampedScale + dx,
        y: newCenter.y - pointTo.y * clampedScale + dy
      };
      
      setStageScale(clampedScale);
      setStagePosition(newPos);
      setLastDist(dist);
      setLastCenter(newCenter);
    }
  }, [stageScale, stagePosition, lastCenter, lastDist, dragStopped]);
  
  const handleTouchEnd = useCallback(() => {
    setLastDist(0);
    setLastCenter(null);
  }, []);
  
  
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
  
  
  // ===== Изображение на холсте =====
  
  // Получаем размеры изображения после загрузки
  useEffect(() => {
    if (image) {
      setImageSize({
        width: image.width,
        height: image.height
      });
    }
    console.log(image);
  }, [image]);
  
  // Автоматическое центрирование изображения
  useEffect(() => {
    if (imageSize.width > 0 && stageSize.width > 0) {
      const scale = Math.min(
        stageSize.width / imageSize.width,
        stageSize.height / imageSize.height
      ) * 0.9; // 90% от размера
      
      setStageScale(scale);
      setStagePosition({
        x: (stageSize.width - imageSize.width * scale) / 2,
        y: (stageSize.height - imageSize.height * scale) / 2
      });
    }
  }, [imageSize, stageSize]);
  
  
  // Обработчик масштабирования
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    
    const oldScale = stageScale;
    const isZoomOut = e.evt.deltaY > 0;
    const newScale = isZoomOut ? oldScale / scaleBy : oldScale * scaleBy;
    
    // Ограничиваем масштаб
    const clampedScale = Math.max(0.1, Math.min(5, newScale));
    setStageScale(clampedScale);
    
    // Позиция указателя относительно сцены
    const mousePointTo = {
      x: (pointer.x - stagePosition.x) / oldScale,
      y: (pointer.y - stagePosition.y) / oldScale
    };
    
    // Вычисляем новую позицию
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale
    };
    
    setStagePosition(newPos);
  };
  
  // Функция преобразования относительных координат в абсолютные
  const getAbsolutePosition = (place: IWorkplace) => {
    if (imageSize.width === 0 || imageSize.height === 0) {
      return { x: place.x, y: place.y }; // Используем старые координаты
    }
    if (!imageSize.width || !imageSize.height)
      return { x: place.x, y: place.y };
    
    return {
      x: (place.x / 100) * imageSize.width,
      y: (place.y / 100) * imageSize.height
    };
  };
  
  
  // ===== Обработчики событий касаний =====
  
  // const handleTouchStart = (e: Konva.KonvaEventObject<TouchEvent>) => {
  //   e.evt.preventDefault();
  //   const touches = e.evt.touches;
  //   if (touches.length === 2) {
  //     const touch1 = touches[0];
  //     const touch2 = touches[1];
  //     const dist = Math.hypot(
  //       touch2.clientX - touch1.clientX,
  //       touch2.clientY - touch1.clientY
  //     );
  //     setLastDist(dist);
  //
  //     const centerX = (touch1.clientX + touch2.clientX) / 2;
  //     const centerY = (touch1.clientY + touch2.clientY) / 2;
  //     setLastCenter({ x: centerX, y: centerY });
  //   }
  // };
  // const handleTouchMove = useCallback((e: Konva.KonvaEventObject<TouchEvent>) => {
  //   e.evt.preventDefault();
  //   const touches = e.evt.touches;
  //   if (touches.length === 2 && lastDist > 0 && lastCenter) {
  //     const touch1 = touches[0];
  //     const touch2 = touches[1];
  //     const newDist = Math.hypot(
  //       touch2.clientX - touch1.clientX,
  //       touch2.clientY - touch1.clientY
  //     );
  //
  //     const newCenterX = (touch1.clientX + touch2.clientX) / 2;
  //     const newCenterY = (touch1.clientY + touch2.clientY) / 2;
  //
  //     const scaleChange = newDist / lastDist;
  //     const newScale = stageScale * scaleChange;
  //
  //     // Ограничение масштаба
  //     const clampedScale = Math.max(0.1, Math.min(5, newScale));
  //     setStageScale(clampedScale);
  //
  //     // Вычисление новой позиции
  //     const dx = newCenterX - lastCenter.x;
  //     const dy = newCenterY - lastCenter.y;
  //
  //     setStagePosition(prev => ({
  //       x: prev.x + dx,
  //       y: prev.y + dy
  //     }));
  //
  //     setLastDist(newDist);
  //     setLastCenter({ x: newCenterX, y: newCenterY });
  //   }
  // });
  // const handleTouchEnd = (e: Konva.KonvaEventObject<TouchEvent>) => {
  //   e.evt.preventDefault();
  //   setLastDist(0);
  //   setLastCenter(null);
  // };
  // const handleDoubleTap = (e: Konva.KonvaEventObject<TouchEvent>) => {
  //   const now = Date.now();
  //   if (lastTap && now - lastTap < 300) {
  //     // Двойное касание - сброс масштаба и позиции
  //     setStageScale(1);
  //     setStagePosition({ x: 0, y: 0 });
  //   }
  //   setLastTap(now);
  // };
  
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

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const now = new Date();
    
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
    if (!selectedPlace) return;
    if (statusShowDetails.status) {
      setStatusShowDetails(prev => ({...prev, status: false}));
      return;
    }
    const book = getBook(selectedPlace);
    if (!book) return;
    const user = await UsersService.getUserById(book.user_id);
    if (!user) return;
    setStatusShowDetails(prev => ({...prev, status: true, user: user.data, book}));
  };
  
  
  const cancelBook = async () => {
    if (!selectedPlace || !statusShowDetails.book?.id) return;
    // if (!selectedPlace) return;
    // if (!statusShowDetails.book || !statusShowDetails.book.id) return;
    await BookingService.deleteBook(statusShowDetails.book.id);
    setStatusSelectedPlace(null);
    setStatusShowDetails({status: false, user: null, book: null});
    refreshBookings();
  };
  
  
  return (
    <div className={styles['konva']}>
      <div className={styles['konva__container']} ref={containerRef}>
        {/* Холст с рабочими местами */}
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          onClick={handleStageClick}
          onTap={handleStageClick}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          scaleX={stageScale}
          scaleY={stageScale}
          position={stagePosition}
          onWheel={handleWheel}
          draggable
        >
          <Layer>
            {/* Добавляем изображение */}
            {image && (
              <Image
                image={image}
                width={imageSize.width}
                height={imageSize.height}
              />
            )}
            {/* Рендерим рабочие места */}
            {workplaces.map((place) => {
              const absPos = getAbsolutePosition(place);
              return (
                <React.Fragment key={place.id}>
                  <Circle
                    x={absPos.x}
                    y={absPos.y}
                    radius={(place.radius / 100) * imageSize.width}
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
                    x={absPos.x - 10}
                    y={absPos.y - 8}
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
              );
            })}
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
  );
}


export default CanvasUser;
