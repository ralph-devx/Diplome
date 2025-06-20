import styles from './CanvasAdmin.module.scss';
import { CanvasAdminProps } from './CanvasAdmin.props.ts';
import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { Circle, Layer, Stage, Transformer, Text, Group } from 'react-konva';
import Button from '../../UI_UX/Button/Button.tsx';
import OfficesService from '../../../networking/services/OfficesService.ts';
import { IWorkplace } from '../../../networking/models/IWorkplace.ts';
import Input from '../../UI_UX/Input/Input.tsx';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';


const MIN_RADIUS = 20; // Ограничения размера рабочих мест
const MAX_RADIUS = 60;
const BOUNDARY_PADDING = 10; // Отступ от границ холста


function CanvasAdmin({ workplaces, onUpdate, refresh, floorId }: CanvasAdminProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [modifiedWorkplaces, setModifiedWorkplaces] = useState<IWorkplace[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedWp, setSelectedWp] = useState<IWorkplace | null>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  // const { store } = useContext(Context);
  
  console.log('[COMP RENDER] CanvasAdmin');
  
  // Инициализация размеров и начальное состояние
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    // console.log('useEffect');

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Инициализация modifiedWorkplaces только при первом рендере или при изменении workplaces
  useEffect(() => {
    if (JSON.stringify(workplaces) !== JSON.stringify(modifiedWorkplaces)) {
      setModifiedWorkplaces([...workplaces]);
    }
    // Убираем modifiedWorkplaces из зависимостей, чтобы избежать цикла
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workplaces]);


  // Привязка трансформера к выбранному элементу
  useEffect(() => {
    if (!transformerRef.current || selectedId === null) return;
    
    const stage = transformerRef.current.getStage();
    const selectedNode = stage?.findOne(`#group-${selectedId}`);

    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId]);
  
  
  // Добавляем ключ этажа для принудительного обновления Stage
  const stageKey = floorId ? `stage-${floorId}` : 'stage-default';
  
  
  // ===== Обработчики событий =====


  // старый обработчик выбора элемента
  // const handleSelect = (e: Konva.KonvaEventObject<MouseEvent>) => {
  //   const target = e.target;
  //   if (target instanceof Konva.Group) {
  //     setSelectedId(Number(target.id().replace('group-', '')));
  //   } else {
  //     setSelectedId(null);
  //   }
  // };
  
  // Обработчик выбора элемента
  const handleSelect = (e: Konva.KonvaEventObject<MouseEvent | Event>, place?: IWorkplace) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      setSelectedWp(null);
      return;
    }
    
    let group: Konva.Node | null = e.target;
    while (group && !(group instanceof Konva.Group)) {
      group = group.getParent();
    }
    if (group) {
      setSelectedId(Number(group.id().replace('group-', '')));
    }
    if (place) {
      setSelectedWp(place);
    }
  };

  // Ограничение перемещения
  const handleDragBound = (pos: Konva.Vector2d, radius: number) => {
    return {
      x: Math.max(radius + BOUNDARY_PADDING,
        Math.min(stageSize.width - radius - BOUNDARY_PADDING, pos.x)),
      y: Math.max(radius + BOUNDARY_PADDING,
        Math.min(stageSize.height - radius - BOUNDARY_PADDING, pos.y))
    };
  };

  // Обработка изменения размера
  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const group = e.target as Konva.Group;
    const circle = group.findOne<Konva.Circle>('Circle');
    const text = group.findOne<Konva.Text>('Text');
    
    if (!circle || !text) return;

    const scaleX = circle.scaleX();
    const scaleY = circle.scaleY();
    
    // Сбрасываем масштаб группы, чтобы применить изменения к радиусу
    group.scaleX(1);
    group.scaleY(1);
    
    // Вычисляем новый радиус с ограничениями
    const newRadius = Math.max(
      MIN_RADIUS,
      Math.min(MAX_RADIUS, circle.radius() * scaleX)
    );
    
    // Обновляем позицию с учётом границ
    const newPos = handleDragBound(
      { x: group.x(), y: group.y() },
      newRadius
    );

    // Обновляем группу и круг (применяем изменения)
    group.position(newPos);
    circle.radius(newRadius);
    
    // Масштабируем текст пропорционально (опционально)
    text.scaleX(1 / scaleX); // Отменяем искажение
    text.scaleY(1 / scaleY);
    
    console.log(modifiedWorkplaces);
    // Обновляем состояние
    setModifiedWorkplaces(prev =>
      prev.map(wp =>
        wp.id === Number(group.id().replace('group-', ''))
          ? {
            ...wp,
            x: newPos.x,
            y: newPos.y,
            radius: newRadius
          }
          : wp
      )
    );
  };

  // Обработка перемещения
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const group = e.target as Konva.Group;
    const id = Number(group.id().replace('group-', ''));

    setModifiedWorkplaces(prev =>
      prev.map(wp =>
        wp.id === id
          ? { ...wp, x: group.attrs.x, y: group.attrs.y }
          : wp
      )
    );
  };

  
  const createWorkplace = async () => {
    // console.log(workplaces);
    // setModifiedWorkplaces(prev => [...prev, {
    //   id: workplaces[workplaces.length-1].id + 1,
    //   // floor_id: workplaces[0].floor_id,
    //   title: '?',
    //   x: 150,
    //   y: 150,
    //   radius: 20
    // }]);
    if (!floorId) return;
    const res = await OfficesService.createWorkplace({
      floor_id: floorId,
      title: '?',
      x: 150,
      y: 150,
      radius: 20
    });
    setModifiedWorkplaces(prev => [...prev, res.data]);
  };
  
  
  // Сохранение изменений
  const handleSave = async () => {
    onUpdate(modifiedWorkplaces);
  };

  // Сохранение изменения названия рабочего места
  const saveSelectedWp = async () => {
    if (!selectedWp) return;
    for (const wp of modifiedWorkplaces) {
      if (wp.id === selectedWp.id) {
        if (selectedWp.title === wp.title) return;
        await OfficesService.updateWorkplace([selectedWp]);
        refresh();
        return;
      }
    }
  };
  const deleteWp = async () => {
    if (!selectedWp) return;
    await OfficesService.deleteWorkplace(selectedWp.id);
    refresh();
  };

  return (
    <OverlayScrollbarsComponent>
      <div className={styles['konva']}>
        <div className={styles['konva__container']} ref={containerRef}>
          <Stage
            key={stageKey}
            width={stageSize.width}
            height={stageSize.height}
            onClick={handleSelect}
            onTap={handleSelect}
          >
            <Layer>
              {modifiedWorkplaces.map(place => (
                <Group
                  key={place.id}
                  id={`group-${place.id}`}
                  x={place.x}
                  y={place.y}
                  draggable
                  dragBoundFunc={pos => handleDragBound(pos, place.radius || 30)}
                  onDragEnd={handleDragEnd}
                  onTransformEnd={handleTransformEnd}
                  onClick={(e) => handleSelect(e, place)}
                  onTap={(e) => handleSelect(e, place)}
                >
                  <Circle
                    id={`circle-${place.id}`}
                    x={0}
                    y={0}
                    radius={place.radius || 30}
                    fill="#4CAF50"
                    stroke="#2196F3"
                    strokeWidth={selectedId === place.id ? 3 : 1}
                  />
                  <Text
                    id={`text-${place.id}`}
                    x={-10}
                    y={-8}
                    text={place.title}
                    fontSize={16}
                    fill="#FFF"
                    fontFamily="Arial, sans-serif"
                    fontStyle="bold"
                  />
                </Group>
              ))}
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Запрещаем изменение размера меньше MIN_RADIUS
                  if (newBox.width < MIN_RADIUS * 2 ||
                    newBox.height < MIN_RADIUS * 2) {
                    return oldBox;
                  }
                  // Запрещаем изменение размера больше MAX_RADIUS
                  if (newBox.width > MAX_RADIUS * 2 || newBox.height > MAX_RADIUS * 2) {
                    return oldBox;
                  }
                  return newBox;
                }}
                anchorSize={10}
                borderStroke="#2196F3"
                anchorStroke="#2196F3"
                anchorCornerRadius={5}
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                rotateEnabled={false}
              />
            </Layer>
          </Stage>
          {floorId && <Button className={styles['konva__addwp']} onClick={createWorkplace}>
            <svg className={styles['konva__addwp-icon']} viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.34615 0.846154C6.34615 0.378125 5.96803 0 5.5 0C5.03197 0 4.65385 0.378125 4.65385 0.846154V4.65385H0.846154C0.378125 4.65385 0 5.03197 0 5.5C0 5.96803 0.378125 6.34615 0.846154 6.34615H4.65385V10.1538C4.65385 10.6219 5.03197 11 5.5 11C5.96803 11 6.34615 10.6219 6.34615 10.1538V6.34615H10.1538C10.6219 6.34615 11 5.96803 11 5.5C11 5.03197 10.6219 4.65385 10.1538 4.65385H6.34615V0.846154Z"
                fill="white"/>
            </svg>
          </Button>}
          
          {selectedWp && (<div className={styles['konva__wpedit']}>
            <Input
              className={styles['konva__wpedit-input']}
              placeholder={'Название...'}
              value={`${selectedWp.title}`}
              onChange={(e) => {
                const newWp = {...selectedWp};
                newWp.title = e.target.value;
                setSelectedWp(newWp);
              }}
            />
            <div className={styles['konva__wpedit-actions']}>
              <Button className={styles['konva__wpedit-save']} onClick={saveSelectedWp}>
                <svg className={styles['konva__wpedit-save-icon']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path className={styles['konva__wpedit-save-icon-fill']} d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                </svg>
              </Button>
              <Button className={styles['konva__wpedit-del']} onClick={deleteWp} appearance={'red'}>
                <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.13036 0.671652L4.85714 1.21429H1.21429C0.542634 1.21429 0 1.75692 0 2.42857C0 3.10022 0.542634 3.64286 1.21429 3.64286H15.7857C16.4574 3.64286 17 3.10022 17 2.42857C17 1.75692 16.4574 1.21429 15.7857 1.21429H12.1429L11.8696 0.671652C11.6647 0.258036 11.2435 0 10.7844 0H6.21563C5.75647 0 5.33527 0.258036 5.13036 0.671652ZM15.7857 4.85714H1.21429L2.01875 17.721C2.07946 18.681 2.87634 19.4286 3.83638 19.4286H13.1636C14.1237 19.4286 14.9205 18.681 14.9812 17.721L15.7857 4.85714Z"
                    fill="white"/>
                </svg>
              </Button>
            </div>
          </div>)}
        </div>
        
        <div className={styles['konva__controls']}>
          <Button onClick={handleSave} className={styles['saveButton']}>
            Сохранить изменения
          </Button>
          <div className={styles['konva__hint']}>
            <p>• Кликните на рабочее место для выбора</p>
            <p>• Перетаскивайте для перемещения</p>
            <p>• Используйте маркеры для изменения размера</p>
            <p>• Минимальный размер: {MIN_RADIUS}px, Максимальный: {MAX_RADIUS}px</p>
          </div>
        </div>
      </div>
    </OverlayScrollbarsComponent>
  );
}

// function CanvasAdmin({ workplaces, onUpdate }: CanvasAdminProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
//   const [modifiedWorkplaces, setModifiedWorkplaces] = useState<IWorkplace[]>([]);
//   const [selectedId, setSelectedId] = useState<number | null>(null);
//   const transformerRef = useRef<Konva.Transformer>(null);
//   const groupsRef = useRef<{[key: string]: Konva.Group}>({});
//
//   // Инициализация и обновление размеров
//   useEffect(() => {
//     setModifiedWorkplaces([...workplaces]);
//
//     const updateSize = () => {
//       if (containerRef.current) {
//         setStageSize({
//           width: containerRef.current.offsetWidth,
//           height: containerRef.current.offsetHeight
//         });
//       }
//     };
//
//     updateSize();
//     window.addEventListener('resize', updateSize);
//     return () => window.removeEventListener('resize', updateSize);
//   }, [workplaces]);
//
//   // Привязка трансформера к выбранному элементу
//   useEffect(() => {
//     if (!transformerRef.current) return;
//
//     if (selectedId !== null) {
//       const group = groupsRef.current[`group-${selectedId}`];
//       if (group) {
//         transformerRef.current.nodes([group]);
//         transformerRef.current.getLayer()?.batchDraw();
//       }
//     } else {
//       transformerRef.current.nodes([]);
//     }
//   }, [selectedId]);
//
//   // Обработчик выбора элемента
//   const handleSelect = (e: Konva.KonvaEventObject<MouseEvent>) => {
//     if (e.target === e.target.getStage()) {
//       setSelectedId(null);
//       return;
//     }
//
//     let group = e.target;
//     while (group && !(group instanceof Konva.Group)) {
//       group = group.getParent();
//     }
//
//     if (group) {
//       setSelectedId(Number(group.id().replace('group-', '')));
//     }
//   };
//
//   // Ограничение перемещения
//   const handleDragBound = (pos: Konva.Vector2d, radius: number) => {
//     return {
//       x: Math.max(radius + BOUNDARY_PADDING,
//         Math.min(stageSize.width - radius - BOUNDARY_PADDING, pos.x)),
//       y: Math.max(radius + BOUNDARY_PADDING,
//         Math.min(stageSize.height - radius - BOUNDARY_PADDING, pos.y))
//     };
//   };
//
//   // Обработка перемещения
//   const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
//     const group = e.target as Konva.Group;
//     const circle = group.findOne<Konva.Circle>('Circle');
//     if (!circle) return;
//
//     const radius = circle.radius();
//     const newPos = handleDragBound(
//       { x: group.x(), y: group.y() },
//       radius
//     );
//
//     // Корректируем позицию в реальном времени
//     group.position(newPos);
//   };
//
//   const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
//     const group = e.target as Konva.Group;
//     const id = Number(group.id().replace('group-', ''));
//
//     setModifiedWorkplaces(prev =>
//       prev.map(wp =>
//         wp.id === id
//           ? { ...wp, x: group.x(), y: group.y() }
//           : wp
//       )
//     );
//   };
//
//   // Обработка изменения размера
//   const handleTransform = (e: Konva.KonvaEventObject<Event>) => {
//     const group = e.target as Konva.Group;
//     const circle = group.findOne<Konva.Circle>('Circle');
//     if (!circle) return;
//
//     // Применяем ограничения размера в реальном времени
//     const scale = circle.scaleX();
//     const newRadius = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, circle.radius() * scale));
//
//     // Корректируем масштаб
//     circle.radius(newRadius);
//     circle.scaleX(1);
//     circle.scaleY(1);
//
//     // Корректируем позицию с учетом нового размера
//     const newPos = handleDragBound(
//       { x: group.x(), y: group.y() },
//       newRadius
//     );
//     group.position(newPos);
//   };
//
//   const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
//     const group = e.target as Konva.Group;
//     const circle = group.findOne<Konva.Circle>('Circle');
//     if (!circle) return;
//
//     const id = Number(group.id().replace('group-', ''));
//
//     setModifiedWorkplaces(prev =>
//       prev.map(wp =>
//         wp.id === id
//           ? {
//             ...wp,
//             x: group.x(),
//             y: group.y(),
//             radius: circle.radius()
//           }
//           : wp
//       )
//     );
//   };
//
//   const handleSave = async () => {
//     onUpdate(modifiedWorkplaces);
//   };
//
//   return (
//     <div className={styles['adminContainer']}>
//       <div className={styles['konvaContainer']} ref={containerRef}>
//         <Stage
//           width={stageSize.width}
//           height={stageSize.height}
//           onClick={handleSelect}
//           onTap={handleSelect}
//         >
//           <Layer>
//             {modifiedWorkplaces.map(place => (
//               <Group
//                 key={`group-${place.id}`}
//                 id={`group-${place.id}`}
//                 x={place.x}
//                 y={place.y}
//                 draggable
//                 onDragMove={handleDragMove}
//                 onDragEnd={handleDragEnd}
//                 onTransform={handleTransform}
//                 onTransformEnd={handleTransformEnd}
//                 onClick={handleSelect}
//                 onTap={handleSelect}
//                 ref={ref => {
//                   if (ref) {
//                     groupsRef.current[`group-${place.id}`] = ref;
//                   }
//                 }}
//               >
//                 <Circle
//                   id={`circle-${place.id}`}
//                   x={0}
//                   y={0}
//                   radius={place.radius || 30}
//                   fill="#4CAF50"
//                   stroke={selectedId === place.id ? '#2196F3' : '#FFF'}
//                   strokeWidth={selectedId === place.id ? 3 : 1}
//                 />
//                 <Text
//                   id={`text-${place.id}`}
//                   x={-10}
//                   y={-8}
//                   text={place.title}
//                   fontSize={16}
//                   fill="#FFF"
//                   fontFamily="Arial, sans-serif"
//                   fontStyle="bold"
//                 />
//               </Group>
//             ))}
//             <Transformer
//               ref={transformerRef}
//               boundBoxFunc={(oldBox, newBox) => {
//                 // Всегда разрешаем трансформацию, так как ограничения применяются в handleTransform
//                 return newBox;
//               }}
//               anchorSize={10}
//               borderStroke="#2196F3"
//               anchorStroke="#2196F3"
//               anchorCornerRadius={5}
//               enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
//               rotateEnabled={false}
//             />
//           </Layer>
//         </Stage>
//       </div>
//
//       <div className={styles['controls']}>
//         <button onClick={handleSave} className={styles['saveButton']}>
//           Сохранить изменения
//         </button>
//         <div className={styles['hint']}>
//           <p>• Кликните на рабочее место для выбора</p>
//           <p>• Перетаскивайте для перемещения</p>
//           <p>• Используйте маркеры для изменения размера</p>
//           <p>• Минимальный размер: {MIN_RADIUS}px, Максимальный: {MAX_RADIUS}px</p>
//         </div>
//       </div>
//     </div>
//   );
// }


export default CanvasAdmin;
