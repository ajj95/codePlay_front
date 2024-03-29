import * as React from 'react';
import { Grid, Typography } from '../../../node_modules/@mui/material/index';
import ReactApexChart from 'react-apexcharts';
import { useState } from 'react';
import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import { useLeaveState } from 'store/module';

export default function VacationDonutChart() {
  // chart options
  const barChartOptions = {
    chart: {
      type: 'donut',

      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
              label: '전체 휴가',
              fontSize: '14px',
              color: 'black'
            },
            value: {
              fontSize: '17px',
              offsetY: 0.5
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    labels: ['사용연차', '잔여연차'],
    colors: ['#FF5733', '#3498DB']

    // xaxis: {
    //   categories: ['잔여휴가', '사용휴가'],
    //   axisBorder: {
    //     show: false
    //   },
    //   axisTicks: {
    //     show: false
    //   }
    // },
    // yaxis: {
    //   show: false
    // },
    // grid: {
    //   show: false
    // }
  };
  //const newCategories = ['새로운 항목 1', '새로운 항목 2'];

  const [options, setOptions] = useState(barChartOptions);
  const theme = useTheme();
  const { primary, secondary } = theme.palette.text;
  const info = theme.palette.info.primary;

  const { leave } = useLeaveState(); //휴가불러오기

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: ['#90caf9', '#e3f2fd'],
      xaxis: {
        labels: {
          style: {
            colors: [primary, secondary]
          }
        }
      },
      tooltip: {
        theme: 'light'
      }
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary, info, secondary]);

  return (
    <>
      {Object.keys(leave).length > 0 && (
        <Grid>
          <ReactApexChart options={options} series={[leave.leave_use, leave.leave_remain]} type="donut" height={190} />
          <Grid container rowSpacing={4} columnSpacing={1} sx={{ mt: -3 }}>
            <Grid item xs={4}>
              <MainCard>
                <Typography style={{ textAlign: 'center', fontSize: '1rem' }} sx={{ mb: 1 }}>
                  전체 휴가
                </Typography>
                <Typography variant="h5" style={{ textAlign: 'center' }}>
                  {leave.leave_total}일
                </Typography>
              </MainCard>
            </Grid>
            <Grid item xs={4}>
              <MainCard>
                <Typography style={{ textAlign: 'center', fontSize: '1rem' }} sx={{ mb: 1 }}>
                  사용 휴가
                </Typography>
                <Typography variant="h5" style={{ textAlign: 'center' }}>
                  {leave.leave_use}일
                </Typography>
              </MainCard>
            </Grid>
            <Grid item xs={4}>
              <MainCard>
                <Typography style={{ textAlign: 'center', fontSize: '1rem' }} sx={{ mb: 1 }}>
                  잔여 휴가
                </Typography>
                <Typography variant="h5" style={{ textAlign: 'center' }}>
                  {leave.leave_remain}일
                </Typography>
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}
