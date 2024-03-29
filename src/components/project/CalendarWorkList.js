import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { Chip } from '../../../node_modules/@mui/material/index';
import { useCalendarGetScheduleList } from 'store/module';

export default function CalendarList() {
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const { dataList } = useCalendarGetScheduleList();

  dataList.sort((a, b) => {
    const dateA = new Date(a.schedule_startday);
    const dateB = new Date(b.schedule_startday);
    return dateA - dateB;
  });

  const currentDate = new Date();

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        maxHeight: 266,
        overflow: 'auto'
        // '&::-webkit-scrollbar': {
        //   width: '0' // 스크롤바의 너비를 0으로 설정하여 투명하게 만듭니다.
        // }
      }}
    >
      {dataList.map((value) => {
        const labelId = `checkbox-list-label-${value}`;
        const scheduleEndDay = new Date(value.schedule_endday);
        const scheduleStartDay = new Date(value.schedule_startday);

        if (
          scheduleEndDay > currentDate ||
          (scheduleEndDay.getFullYear() === currentDate.getFullYear() &&
            scheduleEndDay.getMonth() === currentDate.getMonth() &&
            scheduleStartDay.getDate() <= currentDate.getDate() &&
            currentDate.getDate() <= scheduleEndDay.getDate())
        ) {
          if (value.schedule_cardview) {
            const diffTime = Math.abs(scheduleStartDay.getTime() - currentDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return (
              <ListItem key={value.schedule_no} disablePadding>
                <ListItemButton role={undefined} onClick={handleToggle(value.schedule_no)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                      sx={{ pointerEvents: 'none' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={value.schedule_title}
                    primaryTypographyProps={{ fontSize: '13px', fontWeight: 'bold' }}
                  />
                  <Chip
                    label={
                      scheduleStartDay.getFullYear() == currentDate.getFullYear() &&
                      scheduleStartDay.getMonth() == currentDate.getMonth() &&
                      scheduleStartDay.getDate() <= currentDate.getDate() &&
                      currentDate.getDate() <= scheduleEndDay.getDate()
                        ? 'Today'
                        : `${diffDays} day`
                    }
                    color="primary"
                    size="small"
                    variant={
                      scheduleStartDay.getFullYear() == currentDate.getFullYear() &&
                      scheduleStartDay.getMonth() == currentDate.getMonth() &&
                      scheduleStartDay.getDate() <= currentDate.getDate() &&
                      currentDate.getDate() <= scheduleEndDay.getDate()
                        ? ''
                        : 'outlined'
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          }
        }
      })}
    </List>
  );
}
