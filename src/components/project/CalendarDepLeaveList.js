import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Grid, ListItemButton } from '../../../node_modules/@mui/material/index';
import { useCalendarGetScheduleList } from 'store/module';

export default function CalendarDepLeaveList() {
  const { shereLeaveDataList } = useCalendarGetScheduleList();
  // eslint-disable-next-line no-unused-vars
  const handleToggle = (value) => () => {
    // const currentIndex = checked.indexOf(value);
    // const newChecked = [...checked];
    // if (currentIndex === -1) {
    //   newChecked.push(value);
    // } else {
    //   newChecked.splice(currentIndex, 1);
    // }
    // setChecked(newChecked);
  };

  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {shereLeaveDataList.map((value) => {
          const originalStartDateTime = value.leaveapp_start; // 시작 날짜 및 시간
          const originalEndDateTime = value.leaveapp_end; // 종료 날짜 및 시간

          // 시작 날짜 포맷
          const originalStartDate = new Date(originalStartDateTime.split('T')[0]);
          const formattedStartDate = `${originalStartDate.getFullYear()}-${(originalStartDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${originalStartDate.getDate().toString().padStart(2, '0')}`;

          // 종료 날짜 포맷
          const originalEndDate = new Date(originalEndDateTime.split('T')[0]);
          const formattedEndDate = `${originalEndDate.getFullYear()}-${(originalEndDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${originalEndDate.getDate().toString().padStart(2, '0')}`;

          return (
            <>
              <ListItem alignItems="flex-start" sx={{ p: 0.5 }}>
                <ListItemButton role={undefined} onClick={handleToggle()} dense>
                  <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                    <Grid item xs={2} sx={{ ml: -1 }}>
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={`${value.user.user_profile}`} sx={{ width: 30, height: 30 }} />
                      </ListItemAvatar>
                    </Grid>
                    <Grid item xs={6} sx={{ ml: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      <ListItemText>
                        <Grid container direction="column" justifyContent="center" alignItems="flex-start" sx={{ ml: -1 }}>
                          <Typography component="span" variant="body2" color="text.primary">
                            {value.user.user_name}
                          </Typography>
                          <Typography component="span" variant="body3" color="text.primary">
                            {value.leaveapp_title}
                          </Typography>
                        </Grid>
                      </ListItemText>
                    </Grid>
                    <Grid item xs={4}>
                      <ListItemText>
                        <Grid container direction="column" justifyContent="space-between" alignItems="center" sx={{ ml: 1.5 }}>
                          <Typography component="span" variant="body2" color="text.primary">
                            {`${formattedStartDate}`}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.primary">
                            {`${formattedEndDate}`}
                          </Typography>
                        </Grid>
                      </ListItemText>
                    </Grid>
                  </Grid>
                </ListItemButton>
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          );
        })}
      </List>
    </>
  );
}
