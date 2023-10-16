import { Typography, Box, Grid, Tab, Tabs } from '@mui/material';
import ComponentSkeleton from './components-overview/ComponentSkeleton';

import BasicTab from 'components/tab/BasicTab';

import MainCard from 'components/MainCard';
import { useState } from 'react';
import { Avatar } from '../../node_modules/@mui/material/index';

import ApprovalWaitTable from 'components/Table/ApprovalWaitTable';


const SeeUserAttendance = () => {
  const [value, setValue] = useState(0);
  const [value2, setValue2] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange3 = (event, newValue) => {
    setValue2(newValue);
  };

  return (
    <ComponentSkeleton>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="휴가" />
          <Tab label="출/퇴근" />
        </Tabs>
      </Box>

      <BasicTab value={value} index={0}>
        <Grid item xs={12} sm={6} md={5} lg={7}>
          <MainCard>
            <Grid container direction="column" xs={12}>
              <Grid item container direction="row" xs={12}>
                <Grid item xs={3}>
                  <Avatar sx={{ width: 200, height: 200 }}>프로필 사진</Avatar>
                </Grid>
                <Grid item container direction="column" justifyContent="space-around" xs={4}>
                  <Grid item container direction="row">
                    <Grid item xs={3}>
                      <Typography variant="body2">부서</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2">개발팀</Typography>
                    </Grid>
                  </Grid>
                  <Grid item container direction="row">
                    <Grid item xs={3}>
                      <Typography variant="body2">직책</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2">연구원</Typography>
                    </Grid>
                  </Grid>
                  <Grid item container direction="row">
                    <Grid item xs={3}>
                      <Typography variant="body2">이름</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2">홍길동</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item container direction="column" xs={5}>
                  <MainCard title="결재대기내역">
                    <ApprovalWaitTable/>
                    
                    
                  </MainCard>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value2} onChange={handleChange3} aria-label="basic tabs example">

            <Tab label="승인" />
            <Tab label="반려" />
          </Tabs>
        </Box>
        <BasicTab value={value2} index={0}>
          <Grid item xs={12}>
            <MainCard>

            </MainCard>
          </Grid>
        </BasicTab>
        <BasicTab value={value2} index={1}>
          <Grid item xs={12}>
            <MainCard>

            </MainCard>
          </Grid>
        </BasicTab>
      </BasicTab>

      <BasicTab value={value} index={1}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value2} onChange={handleChange3} aria-label="basic tabs example">
            <Tab label="승인" />
            <Tab label="반려" />
          </Tabs>
        </Box>
        <BasicTab value={value2} index={0}>
          <Grid item xs={12} sm={6} md={5} lg={7}>
            <MainCard>zz</MainCard>
          </Grid>
        </BasicTab>
        <BasicTab value={value2} index={1}>
          <Grid item xs={12} sm={6} md={5} lg={7}>
            <MainCard></MainCard>
          </Grid>
        </BasicTab>
      </BasicTab>
    </ComponentSkeleton>
  );
};

export default SeeUserAttendance;