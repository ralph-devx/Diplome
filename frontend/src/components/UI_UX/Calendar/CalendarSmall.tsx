// import styles from './CalendarSmall.module.scss';
import { Calendar, theme } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import { SelectInfo } from 'antd/es/calendar/generateCalendar';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import dayLocaleData from 'dayjs/plugin/localeData';
dayjs.locale('ru');
dayjs.extend(dayLocaleData);




function CalendarSmall() {
  const { token } = theme.useToken();
  
  const wrapperStyle: React.CSSProperties = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG
  };
  
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };
  
  const onSelectCalendar = (ate: Dayjs, selectInfo: SelectInfo) => {
    // console.log(value.format('YYYY-MM-DD'), mode);
    console.log(ate.format('YYYY-MM-DD'), selectInfo);
    // console.log(ate, selectInfo);
  };
  
  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} onPanelChange={onPanelChange} onSelect={onSelectCalendar}/>
    </div>
  );
}


export default CalendarSmall;
