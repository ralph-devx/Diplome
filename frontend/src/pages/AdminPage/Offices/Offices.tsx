import styles from './Offices.module.scss';
import SelectOffice from '../../../components/UI_UX/SelectOffice/SelectOffice.tsx';
import OfficesService from '../../../networking/services/OfficesService.ts';
import { IWorkplace } from '../../../networking/models/IWorkplace.ts';
import { IOffice } from '../../../networking/models/IOffice.ts';
import CanvasAdmin from '../../../components/KonvaCanvaces/CanvasAdmin/CanvasAdmin.tsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ICreateFloor, IFloor } from '../../../networking/models/IFloor.ts';
import cn from 'classnames';
import Button from '../../../components/UI_UX/Button/Button.tsx';
import ModalBasis from '../../../components/Modals/ModalBasis/ModalBasis.tsx';
import EditOffices from '../../../components/Modals/EditOffices/EditOffices.tsx';
import { BASE_URL } from '../../../networking/http';
import { UploadOutlined } from '@ant-design/icons';
import { Button as AntdButton, message, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';


function Offices() {
  const [offices, setOffices] = useState<IOffice[]>([]);
  const [floors, setFloors] = useState<IFloor[]>([]);
  const [workplaces, setWorkplaces] = useState<IWorkplace[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Добавляем состояние загрузки
  const windowDelFloor = useRef<HTMLDivElement>(null);
  const [candidateDelFloor, setCandidateDelFloor] = useState<IFloor | null>(null);
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [currentFloorImage, setCurrentFloorImage] = useState<string | null>(null);
  const [activeModalEOF, setActiveModalEOF] = useState(false);
  const [uploading, setUploading] = useState(false); // состояние загрузки для input[file]
  
  
  // получение всей информации про офисы
  const getOffices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await OfficesService.getOfficesOnly();
      setOffices(res.data.sort((a: IOffice, b: IOffice) => a.id - b.id));
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    getOffices();
  }, [getOffices]);
  
  const getOfficeBySelected = useCallback(() => {
    // for (const office of offices) {
    //   if (office.id === selectedOffice) {
    //     return office;
    //   }
    // }
    // return null;
    return offices.find((office) => office.id === selectedOffice);
  }, [offices, selectedOffice]);
  
  
  // обработка нажатия пкм - для показа кнопки удаления
  const showWindowDelFloor = (e: React.MouseEvent<HTMLButtonElement>, floor: IFloor) => {
    console.log(floor);
    setCandidateDelFloor(floor);
    e.preventDefault();
    if (!windowDelFloor.current) return;
    // const sizes = e.currentTarget.getBoundingClientRect();
    const elem = e.currentTarget;
    const width = elem.offsetLeft + (elem.offsetWidth / 2) - (windowDelFloor.current.offsetWidth / 2);
    
    windowDelFloor.current.style.top = `${elem.offsetHeight + 5}px`;
    windowDelFloor.current.style.left = `${width}px`;
    windowDelFloor.current.classList.add(styles['offices__floor-del_active']);
    
    // если нажатие вне кнопки, она исчезнет:
    const handleClick = (e: MouseEvent) => {
      if (windowDelFloor.current && windowDelFloor.current.contains(e.target as HTMLElement)) return;
      if (windowDelFloor.current) {
        windowDelFloor.current.classList.remove(styles['offices__floor-del_active']);
      }
      return () => {
        document.removeEventListener('mousedown', handleClick);
      };
    };
    document.addEventListener('mousedown', handleClick);
  };
  
  
  // подгрузка этажей в зависимости от выбранного офиса
  const getFloors = useCallback(async () => {
    if (!selectedOffice) return;
    const res = await OfficesService.getFloors(selectedOffice);
    setFloors(res.data.sort((a: IFloor, b: IFloor) => a.level - b.level));
    setWorkplaces([]);
  }, [selectedOffice]);
  useEffect(() => {
    if (selectedOffice) {
      getFloors();
    }
  }, [getFloors, selectedOffice, offices]);
  
  
  const getWorkplaces = useCallback(async (floorId: number | null) => {
    if (!floorId) return;
    setWorkplaces([]);
    try {
      const res = await OfficesService.getWorkplaces(floorId);
      setWorkplaces(res.data.sort((a: IWorkplace, b: IWorkplace) => a.id - b.id));
    } catch (e) {
      console.error('Error loading workplaces:', e);
    }
  }, [selectedFloorId]);
  
  
  const saveWorkplacesChanges = async (wps: IWorkplace[]) => {
    const {data} = await OfficesService.updateWorkplace(wps);
    console.log(data);
    setWorkplaces(data);
  };
  
  
  const createNewFloor = async () => {
    const curOffice = getOfficeBySelected();
    if (!curOffice) return;
    
    const nextLevel = floors.length > 0
      ? Math.max(...floors.map(f => f.level)) + 1
      : 1;
    const data: ICreateFloor = {
      office_id: curOffice.id,
      level: nextLevel
    };
    await OfficesService.createFloor(data);
    await getFloors();
  };
  
  
  const deleteFloor = async () => {
    if (!candidateDelFloor) return;
    await OfficesService.deleteFloors(candidateDelFloor?.id);
    await getFloors();
    if (windowDelFloor.current) {
      windowDelFloor.current.classList.remove(styles['offices__floor-del_active']);
    }
    setCandidateDelFloor(null);
    setSelectedFloorId(null);
  };
  
  // Обработчик выбора этажа
  const handleFloorSelect = (floor: IFloor) => {
    // Если выбран уже активный этаж - ничего не делаем
    if (selectedFloorId === floor.id && workplaces.length > 0) return;
    setSelectedFloorId(floor.id);
    getWorkplaces(floor.id);
  };
  
  
  const drawFloors = () => {
    // if (!offices) return;
    // const office = getOfficeBySelected();
    // if (office === null) return;
    // let floors: IFloor[] = await OfficesService.getFloors(office.id);
    // floors = floors.sort((a: IFloor, b: IFloor) => a.level - b.level);
    if (!selectedOffice) return;
    return (
      <div className={styles['offices__floors']}>
        {floors.map(floor => (
          <button
            key={floor.id}
            className={cn('btn-reset', styles['offices__floor'])}
            onClick={() => {
              setCurrentFloorImage(floor.image || null);
              handleFloorSelect(floor);
            }}
            onContextMenu={(e) => showWindowDelFloor(e, floor)}
          >{floor.level}</button>
        ))
        }
        <button
          className={cn('btn-reset', styles['offices__floor'], styles['offices__floor-add'])}
          onClick={createNewFloor}>
          <svg className={styles['offices__floor-add-icon']} viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.34615 0.846154C6.34615 0.378125 5.96803 0 5.5 0C5.03197 0 4.65385 0.378125 4.65385 0.846154V4.65385H0.846154C0.378125 4.65385 0 5.03197 0 5.5C0 5.96803 0.378125 6.34615 0.846154 6.34615H4.65385V10.1538C4.65385 10.6219 5.03197 11 5.5 11C5.96803 11 6.34615 10.6219 6.34615 10.1538V6.34615H10.1538C10.6219 6.34615 11 5.96803 11 5.5C11 5.03197 10.6219 4.65385 10.1538 4.65385H6.34615V0.846154Z"
              fill="white"/>
          </svg>
        </button>
        <div ref={windowDelFloor} className={styles['offices__floor-del']}>
          <Button className={styles['offices__floor-del-btn']} onClick={deleteFloor} title={'Удалить этаж'}>
            <svg className={styles['offices__floor-del-icon']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path className={styles['offices__floor-del-icon-path']}
                d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
            </svg>
          </Button>
        </div>
      </div>
    );
  };
  
  
  // const setFloorImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files || !selectedFloorId) return;
  //   const formData = new FormData();
  //   formData.append('image', e.target.files[0]);
  //   try {
  //     const res = await OfficesService.updateFloorImage(selectedFloorId, formData);
  //     const updatedFloor = res.data as IFloor;
  //     setCurrentFloorImage(updatedFloor.image || null);
  //     await getFloors();
  //   } catch (error) {
  //     console.error('Error updating floor image:', error);
  //   } finally {
  //     e.target.value = ''; // Сброс input для возможности повторной загрузки того же файла
  //   }
  // };
  
  
  const uploadProps: UploadProps = {
    name: 'image',
    action: 'image/*',
    showUploadList: false, // Скрываем список файлов
    className: styles['offices__upload'],
    beforeUpload: (file: RcFile) => {
      // Проверка типа файла
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Можно загружать только изображения!');
      }
      return isImage;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      if (!selectedFloorId) {
        onError!(new Error('Этаж не выбран'));
        return;
      }
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file as Blob);
        
        // Используем ваш сервис для отправки
        const response = await OfficesService.updateFloorImage(
          selectedFloorId,
          formData
        );
        
        const updatedFloor = response.data as IFloor;
        setCurrentFloorImage(updatedFloor.image || null);
        
        // Обновляем список этажей
        setFloors(prev =>
          prev.map(f => f.id === updatedFloor.id ? updatedFloor : f)
        );
        
        onSuccess!(response.data, new XMLHttpRequest());
        message.success('Изображение успешно загружено');
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        onError!(new Error('Ошибка загрузки'));
        message.error('Ошибка при загрузке изображения');
      } finally {
        setUploading(false);
      }
    }
    // onChange(info) {
    //   // Можно добавить дополнительную логику отслеживания статуса
    // },
  };
  
  
  return (
    <div>
      <ModalBasis isActive={activeModalEOF} setActive={setActiveModalEOF}>
        <EditOffices setClose={setActiveModalEOF} refresh={getOffices} offices={offices}/>
      </ModalBasis>
      <div className={styles['offices__offices']}>
        <SelectOffice
          className={styles['offices__select']}
          placeholder={'Выберите оффис для настройки'}
          data={offices}
          setFun={(id: number) => {
            setSelectedFloorId(null);
            setCurrentFloorImage(null);
            setSelectedOffice(id);
          }}
        />
        <Button className={cn('btn-reset', styles['offices__edit'])} onClick={() => setActiveModalEOF(true)}>
          <svg className={styles['offices__edit-icon']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path className={styles['offices__edit-icon-fill']} d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/>
          </svg>
        </Button>
      </div>
      {isLoading ? (
        <h3 className={styles['offices__loading']}>Загрузка...</h3>
      ) : (
        <>
          {selectedFloorId && (
            <Upload className={styles['offices__upload']} {...uploadProps}>
              <AntdButton
                icon={<UploadOutlined/>}
                disabled={!selectedFloorId || uploading}
                loading={uploading}
                className={styles['offices__upload-button']}
              >
                {uploading ? 'Загрузка...' : 'Загрузить план этажа'}
              </AntdButton>
            </Upload>
          )}
          {drawFloors()}
          <CanvasAdmin
            workplaces={workplaces}
            floorImage={`${BASE_URL}static/${currentFloorImage}`}
            onUpdate={saveWorkplacesChanges}
            refresh={() => getWorkplaces(selectedFloorId || null)}
            floorId={selectedFloorId}
          />
        </>
      )}
    </div>
  );
}


export default Offices;


// первоначальная подгрузка офисов
// const getWorkplaces = useCallback(async () => {
//   const res = await OfficesService.getWorkplaces(1);
//   console.log(res.data);
//   setWorkplaces(res.data);
// }, []);
// useEffect(() => {
//   getWorkplaces();
// }, [getWorkplaces]);

// {/*<div className={styles['offices__crof']}>*/}
// {/*  <h2 className={styles['offices__subtitle']}>Создание офиса</h2>*/}
// {/*  <form className={styles['offices__form']} action="#" onSubmit={createOffice}>*/}
// {/*    <Input name={'name'} placeholder={'Название'}/>*/}
// {/*    <Input name={'address'} placeholder={'Адрес'}/>*/}
// {/*    <Button type={'submit'}>Создать</Button>*/}
// {/*  </form>*/}
// {/*</div>*/}
//
// {/*<div className={styles['offices__crof']}>*/}
// {/*  <h2 className={styles['offices__subtitle']}>Создание этажа офиса</h2>*/}
// {/*  <form className={styles['offices__form']} action="#" onSubmit={createFloor}>*/}
// {/*    <Input name={'office_id'} placeholder={'ID офиса'}/>*/}
// {/*    <Input name={'level'} placeholder={'Уровень этажа'}/>*/}
// {/*    <Button type={'submit'}>Создать</Button>*/}
// {/*  </form>*/}
// {/*</div>*/}
//
// {/*<div className={styles['offices__crof']}>*/}
// {/*  <h2 className={styles['offices__subtitle']}>Создание рабочего места</h2>*/}
// {/*  <form className={styles['offices__form']} action="#" onSubmit={createWorkplace}>*/}
// {/*    <Input name={'floor_id'} placeholder={'ID этажа'}/>*/}
// {/*    <Input name={'title'} placeholder={'Нажвание рабочего места'}/>*/}
// {/*    <Input name={'x'} placeholder={'Расположение по горизонтали'}/>*/}
// {/*    <Input name={'y'} placeholder={'Расположение по вертикали'}/>*/}
// {/*    <Button type={'submit'}>Создать</Button>*/}
// {/*  </form>*/}
// {/*</div>*/}

// const createOffice = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   const formData = new FormData(e.currentTarget);
//   const formProps = Object.fromEntries(formData);
//   const data: ICreateOffice = {
//     name: formProps.name as string,
//     address: formProps.address as string
//   };
//   const res = await OfficesService.createOffice(data);
//   console.log(res);
// };
//
// const createFloor = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   const formData = new FormData(e.currentTarget);
//   const formProps = Object.fromEntries(formData);
//   const data: ICreateFloor = {
//     office_id: Number(formProps.office_id) as number,
//     level: Number(formProps.level) as number
//   };
//   const res = await OfficesService.createFloor(data);
//   console.log(res);
// };
//
// const createWorkplace = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   const formData = new FormData(e.currentTarget);
//   const formProps = Object.fromEntries(formData);
//   const data: ICreateWorkplace = {
//     floor_id: Number(formProps.floor_id) as number,
//     title: formProps.title as string,
//     x: Number(formProps.x) as number,
//     y: Number(formProps.y) as number
//   };
//   const res = await OfficesService.createWorkplace(data);
//   console.log(res);
// };