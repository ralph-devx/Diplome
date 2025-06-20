import styles from './EditOffices.module.scss';
// import Select from '../../UI_UX/Select/Select.tsx';
import Input from '../../UI_UX/Input/Input.tsx';
import Button from '../../UI_UX/Button/Button.tsx';
import { EditOfficesProps } from './EditOffices.props.ts';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import OfficesService from '../../../networking/services/OfficesService.ts';
import { useEffect, useState } from 'react';
import { IOffice } from '../../../networking/models/IOffice.ts';
import cn from 'classnames';



// Определяем тип для одного элемента
interface IEditableOfficeItem {
  id: number;
  name: string;
  address: string;
  editableStatus: boolean;
}

// Тип для всего состояния
interface IEditableOffice {
  [id: number]: IEditableOfficeItem;
}

// interface IEditableOffice {
//   [id: number]: IOffice,
// }



function EditOffices({ setClose, refresh, offices }: EditOfficesProps) {
  const [editableData, setEditableData] = useState<IEditableOffice>({});
  
  useEffect(() => {
    const initialState = offices.reduce((acc, office) => {
      acc[office.id] = {
        id: office.id,
        name: office.name,
        address: office.address,
        editableStatus: false
      };
      return acc;
    }, {} as IEditableOffice);
    
    setEditableData(initialState);
  }, [offices]);
  
  const createOffice = async () => {
    console.log(1);
    let name = `ОФИС #1`;
    if (offices.length > 0) {
      name = `ОФИС #${offices[offices.length - 1].id + 1}`
    }
    await OfficesService.createOffice({
      name: name,
      address: 'Не указано'
    });
    refresh();
  };
  
  
  const deleteOffice = async (id: number) => {
    await OfficesService.deleteOffice(id);
    refresh();
  };
  
  
  const handleOfficeChange = (id: number, key: string, value: string) => {
    setEditableData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
        editableStatus: true
      }
    }));
    // const candidate = offices.map((office: IOffice) => {
    //   if (office.id === id) return office;
    // });
    // if (!candidate) return;
    // if (!checkUpdate(candidate)) {
    //   setEditableData(prev => ({
    //     ...prev,
    //     [id]: {
    //       ...prev[id],
    //       [key]: value,
    //       editableStatus: false
    //     }
    //   }));
    // };
  };
  
  
  const checkUpdate = (candidate: IEditableOfficeItem): boolean => {
    for (const office of offices) {
      if (office.id === candidate.id) {
        if (office.name !== candidate.name || office.address !== candidate.address) {
          return true;
        }
      }
    }
    return false;
  };
  
  
  const updateOffice = async (office: IEditableOfficeItem) => {
    // setEditableData(prev => ({
    //   ...prev,
    //   [office.id]: {
    //     ...prev[office.id],
    //     editableStatus: true
    //   }
    // }));
    if (!checkUpdate(office)) return;
    const data: IOffice = {
      id: office.id,
      name: office.name,
      address: office.address
    };
    await OfficesService.updateOffice(data);
    refresh();
  };
  
  return (
    <>
      <h2 className={styles['eof__title']}>Редактирование офисов</h2>
      <OverlayScrollbarsComponent className={styles['eof__overlay']}>
        <div className={styles['eof__list']}>
          {Object.values(editableData) && Object.values(editableData).map(office => (
            <div className={styles['eof__item']} key={office.id}>
              <div className={styles['eof__item-inputs']}>
                <Input className={styles['eof__item-input']}
                       name={`${office.id}`}
                       value={office.name}
                       onChange={(e) => handleOfficeChange(office.id, 'name', e.target.value)}
                />
                <Input className={styles['eof__item-input']}
                       name={`${office.id}`}
                       value={office.address}
                       onChange={(e) => handleOfficeChange(office.id, 'address', e.target.value)}
                />
              </div>
              <div className={styles['eof__item-actions']}>
                {office.editableStatus && (
                  <Button className={styles['eof__save']} onClick={() => updateOffice(office)} title={'Сохранить изменения'}>
                    <svg className={styles['eof__save-icon']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path className={styles['eof__save-icon-fill']}
                            d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                    </svg>
                  </Button>
                )}
                <Button className={styles['eof__del']} title={'Удалить'} onClick={() => deleteOffice(office.id)}>
                  <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5.13036 0.671652L4.85714 1.21429H1.21429C0.542634 1.21429 0 1.75692 0 2.42857C0 3.10022 0.542634 3.64286 1.21429 3.64286H15.7857C16.4574 3.64286 17 3.10022 17 2.42857C17 1.75692 16.4574 1.21429 15.7857 1.21429H12.1429L11.8696 0.671652C11.6647 0.258036 11.2435 0 10.7844 0H6.21563C5.75647 0 5.33527 0.258036 5.13036 0.671652ZM15.7857 4.85714H1.21429L2.01875 17.721C2.07946 18.681 2.87634 19.4286 3.83638 19.4286H13.1636C14.1237 19.4286 14.9205 18.681 14.9812 17.721L15.7857 4.85714Z"
                      fill="white"/>
                  </svg>
                </Button>
              </div>
            </div>
          ))}
          {Object.values(editableData).length === 0 && (
            <div>офисов нет</div>
          )}
        </div>
      </OverlayScrollbarsComponent>
      <div className={styles['eof__actions']}>
        <Button className={cn(styles['eof__btn'], styles['eof__add'])} onClick={createOffice}>Добавить</Button>
        <Button className={cn(styles['eof__btn'], styles['eof__close'])} appearance={'red'} onClick={() => setClose()}>Закрыть</Button>
      </div>
    </>
  );
}


export default EditOffices;
