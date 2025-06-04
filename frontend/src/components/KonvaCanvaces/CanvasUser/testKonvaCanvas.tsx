import styles from './KonvaCanvas.module.scss';
import { Layer, Rect, Stage, Transformer } from 'react-konva';
import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';


const initialRectangles = [
  {
    x: 60,
    y: 60,
    width: 100,
    height: 90,
    fill: 'red',
    id: 'rect1',
    name: 'rect'
  },
  {
    x: 250,
    y: 100,
    width: 150,
    height: 90,
    fill: 'green',
    id: 'rect2',
    name: 'rect'
  }
];


function TestKonvaCanvas() {
  const [rectangles, setRectangles] = useState(initialRectangles);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectionRectangle, setSelectionRectangle] = useState({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
  });

  const isSelecting = useRef(false);
  const transformerRef = useRef<Konva.Transformer>(null);
  const rectRefs = useRef(new Map());






  // const sceneWidth = 1000;
  // const sceneHeight = 500;
  //
  // const [stageSize, setStageSize] = useState({
  //   width: sceneWidth,
  //   height: sceneHeight,
  //   scale: 1
  // });
  //
  // // Function to handle resize
  // const updateSize = () => {
  //   if (!containerRef.current) return;
  //
  //   // Get container width
  //   const containerWidth = containerRef.current.offsetWidth;
  //
  //   // Calculate scale
  //   const scale = containerWidth / sceneWidth;
  //
  //   // Update state with new dimensions
  //   setStageSize({
  //     width: sceneWidth * scale,
  //     height: sceneHeight * scale,
  //     scale: scale
  //   });
  // };
  // // Update on mount and when window resizes
  // useEffect(() => {
  //   updateSize();
  //   window.addEventListener('resize', updateSize);
  //
  //   return () => {
  //     window.removeEventListener('resize', updateSize);
  //   };
  // }, []);

  const containerRef = useRef(null);
  const stageRef = useRef(null);

  const [scale, setScale] = React.useState(1);
  const [scaleToFit, setScaleToFit] = React.useState(1);
  const [size, setSize] = React.useState({
    width: 1000,
    height: 1000,
    virtualWidth: 1000
  });
  const [virtualWidth, setVirtualWidth] = React.useState(1000);


  // calculate available space for drawing
  React.useEffect(() => {
    const newSize = {
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight
    };
    if (newSize.width !== size.width || newSize.height !== size.height) {
      setSize(newSize);
    }
  }, [size.width, size.height]);

  // calculate initial scale
  React.useEffect(() => {
    if (!stageRef.current) {
      return;
    }
    const stage = stageRef.current;
    const clientRect = stage.getClientRect({ skipTransform: true });

    const scaleToFit = size.width / clientRect.width;
    setScale(scaleToFit);
    setScaleToFit(scaleToFit);
    setVirtualWidth(clientRect.width);
  }, [size]);



  // Update transformer when selection changes
  useEffect(() => {
    if (selectedIds.length && transformerRef.current) {
      // Get the nodes from the refs Map
      const nodes = selectedIds
        .map(id => rectRefs.current.get(id))
        .filter(node => node);
      console.log(transformerRef, typeof transformerRef.current);
      transformerRef.current.nodes(nodes);
    } else if (transformerRef.current) {
      // Clear selection
      transformerRef.current.nodes([]);
    }
  }, [selectedIds]);

  // Click handler for stage
  const handleStageClick = (e/*: Konva.KonvaPointerEvent*/) => {
    console.log(e, typeof e);
    // If we are selecting with rect, do nothing
    if (selectionRectangle.visible) {
      return;
    }

    // If click on empty area - remove all selections
    if (e.target === e.target.getStage()) {
      setSelectedIds([]);
      return;
    }

    // Do nothing if clicked NOT on our rectangles
    if (!e.target.hasName('rect')) {
      return;
    }

    const clickedId = e.target.id();

    // Do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = selectedIds.includes(clickedId);

    if (!metaPressed && !isSelected) {
      // If no key pressed and the node is not selected
      // select just one
      setSelectedIds([clickedId]);
    } else if (metaPressed && isSelected) {
      // If we pressed keys and node was selected
      // we need to remove it from selection
      setSelectedIds(selectedIds.filter(id => id !== clickedId));
    } else if (metaPressed && !isSelected) {
      // Add the node into selection
      setSelectedIds([...selectedIds, clickedId]);
    }
  };

  const handleMouseDown = (e) => {
    // Do nothing if we mousedown on any shape
    if (e.target !== e.target.getStage()) {
      return;
    }

    // Start selection rectangle
    isSelecting.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setSelectionRectangle({
      visible: true,
      x1: pos.x,
      y1: pos.y,
      x2: pos.x,
      y2: pos.y
    });
  };

  const handleMouseMove = (e) => {
    // Do nothing if we didn't start selection
    if (!isSelecting.current) {
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    setSelectionRectangle({
      ...selectionRectangle,
      x2: pos.x,
      y2: pos.y
    });
  };

  const handleMouseUp = () => {
    // Do nothing if we didn't start selection
    if (!isSelecting.current) {
      return;
    }
    isSelecting.current = false;

    // Update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      setSelectionRectangle({
        ...selectionRectangle,
        visible: false
      });
    });

    const selBox = {
      x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
      y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
      width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
      height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1)
    };

    const selected = rectangles.filter(rect => {
      // Check if rectangle intersects with selection box
      return Konva.Util.haveIntersection(selBox, {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      });
    });

    setSelectedIds(selected.map(rect => rect.id));
  };

  const handleDragEnd = (e) => {
    const id = e.target.id();
    setRectangles(prevRects => {
      const newRects = [...prevRects];
      const index = newRects.findIndex(r => r.id === id);
      if (index !== -1) {
        newRects[index] = {
          ...newRects[index],
          x: e.target.x(),
          y: e.target.y()
        };
      }
      return newRects;
    });
  };

  const handleTransformEnd = (e) => {
    // Find which rectangle(s) were transformed
    const nodes = transformerRef.current.nodes();

    const newRects = [...rectangles];

    // Update each transformed node
    nodes.forEach(node => {
      const id = node.id();
      const index = newRects.findIndex(r => r.id === id);

      if (index !== -1) {
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Reset scale
        node.scaleX(1);
        node.scaleY(1);

        // Update the state with new values
        newRects[index] = {
          ...newRects[index],
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY)
        };
      }
    });

    setRectangles(newRects);
  };




  // Helper functions for calculating bounding boxes
  const getCorner = (pivotX, pivotY, diffX, diffY, angle) => {
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    angle += Math.atan2(diffY, diffX);
    const x = pivotX + distance * Math.cos(angle);
    const y = pivotY + distance * Math.sin(angle);
    return { x, y };
  };

  const myGetClientRect = (rotatedBox) => {
    const { x, y, width, height } = rotatedBox;
    const rad = rotatedBox.rotation;

    const p1 = getCorner(x, y, 0, 0, rad);
    const p2 = getCorner(x, y, width, 0, rad);
    const p3 = getCorner(x, y, width, height, rad);
    const p4 = getCorner(x, y, 0, height, rad);

    const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
    const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
    const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
    const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  const getTotalBox = (boxes) => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    boxes.forEach((box) => {
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  // const rectRefs = useRef(new Map());
  const trRef = useRef(null);

  // Set up Transformer after the layer mounts
  // useEffect(() => {
  //   if (trRef.current) {
  //     const nodes = rectangles.map(rect => rectRefs.current.get(rect.id));
  //     trRef.current.nodes(nodes);
  //   }
  // }, [rectangles]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
        virtualWidth: window.innerWidth
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Boundary function for Transformer
  const boundBoxFunc = (oldBox, newBox) => {
    const box = myGetClientRect(newBox);

    const isOut =
      box.x < 0 ||
      box.y < 0 ||
      box.x + box.width > size.width ||
      box.y + box.height > size.height;

    if (isOut) {
      return oldBox;
    }

    return newBox;
  };

  // Handle drag for transformer group
  const handleTransformerDrag = (e) => {
    if (!trRef.current) return;

    const nodes = trRef.current.nodes();
    if (nodes.length === 0) return;

    const boxes = nodes.map(node => node.getClientRect());
    const box = getTotalBox(boxes);

    nodes.forEach(rect => {
      const absPos = rect.getAbsolutePosition();
      const offsetX = box.x - absPos.x;
      const offsetY = box.y - absPos.y;

      const newAbsPos = {...absPos};

      if (box.x < 0) {
        newAbsPos.x = -offsetX;
      }
      if (box.y < 0) {
        newAbsPos.y = -offsetY;
      }
      if (box.x + box.width > size.width) {
        newAbsPos.x = size.width - box.width - offsetX;
      }
      if (box.y + box.height > size.height) {
        newAbsPos.y = size.height - box.height - offsetY;
      }

      rect.setAbsolutePosition(newAbsPos);
    });
  };





  const handleWheel = (e) => {
    e.preventDefault(); // Отменяем стандартное поведение колеса мыши

    const delta = e.evt.deltaY;
    const scale = stage.scaleX();
    const zoomFactor = 1.05; // Коэффициент зуммирования
    let newScale = delta > 0 ? scale / zoomFactor : scale * zoomFactor;

    // Ограничиваем масштаб
    if (newScale < 0.5) {
      newScale = 0.5;
    }
    if (newScale > 3) {
      newScale = 3;
    }

    stage.scale({ x: newScale, y: newScale });
    stage.batchDraw();
  };



  return (
    <div className={styles['konva']} ref={containerRef}>
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        scaleX={scale}
        scaleY={scale}
        onWheel={handleWheel}
        // dragBoundFunc={pos => {
        //   pos.x = Math.min(
        //     size.width / 2,
        //     Math.max(pos.x, -virtualWidth * scale + size.width / 2)
        //   );
        //   pos.y = Math.min(size.height / 2, Math.max(pos.y, -size.height / 2));
        //   return pos;
        // }}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onClick={handleStageClick}
      >
        <Layer>
          {rectangles.map(rect => (
            <Rect
              key={rect.id}
              id={rect.id}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill={rect.fill}
              name={rect.name}
              draggable
              onDragMove={(e) => {
                const node = e.target;
                const stage = node.getStage();

                // Получаем реальные границы элемента (учитывая scale, rotation)
                const itemRect = node.getClientRect();
                const itemWidth = itemRect.width;
                const itemHeight = itemRect.height;

                // Получаем границы холста
                if (!stage) return;
                const stageWidth = stage.width();
                const stageHeight = stage.height();

                // Вычисляем новые координаты
                const newX = Math.max(
                  0,
                  Math.min(node.x(), stageWidth - itemWidth)
                );
                const newY = Math.max(
                  0,
                  Math.min(node.y(), stageHeight - itemHeight)
                );

                // Если элемент выходит за границы — корректируем позицию
                if (newX !== node.x() || newY !== node.y()) {
                  node.position({x: newX, y: newY});
                }
              }}
              ref={node => {
                if (node) {
                  rectRefs.current.set(rect.id, node);
                }
              }}
              onDragEnd={handleDragEnd}
            />
          ))}

          {/* Single transformer for all selected shapes */}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
            onTransformEnd={handleTransformEnd}
          />

          {/* Selection rectangle */}
          {selectionRectangle.visible && (
            <Rect
              x={Math.min(selectionRectangle.x1, selectionRectangle.x2)}
              y={Math.min(selectionRectangle.y1, selectionRectangle.y2)}
              width={Math.abs(selectionRectangle.x2 - selectionRectangle.x1)}
              height={Math.abs(selectionRectangle.y2 - selectionRectangle.y1)}
              fill="rgba(0,0,255,0.5)"
            />
          )}
          <Transformer
            ref={trRef}
            // boundBoxFunc={boundBoxFunc}
            onDragMove={handleTransformerDrag}
          />
        </Layer>
      </Stage>
    </div>
  );
}


export default TestKonvaCanvas;
