import PropTypes from 'prop-types';

// material-ui
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Stack, Typography } from '../../../node_modules/@mui/material/index';
import Dot from 'components/@extended/Dot';
import { useFormatter } from 'store/module';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: 'date',
    align: 'center',
    disablePadding: false,
    label: '날짜'
  },
  {
    id: 'startTime',
    align: 'center',
    disablePadding: false,
    label: '출근시간'
  },
  {
    id: 'endTime',
    align: 'center',
    disablePadding: false,
    label: '퇴근시간'
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: false,
    label: '근태상태'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sx={{ width: `${headCell.id === 'date' ? '120px' : '100px'}`, height: '30px', p: 1, backgroundColor: '#f9f9f9' }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
  let color;
  let title;

  // 정상출근
  // 휴가(연차,오전반차,오후반차,공가)
  // 지각
  // 조퇴(조기퇴근)
  // 결근(출근 혹은 퇴근누락))
  switch (status) {
    case '정상':
      color = 'success';
      title = '정상';
      break;
    case '휴가(연차)':
      color = 'primary';
      title = '연차';
      break;
    case '휴가(오전반차)':
      color = 'primary';
      title = '오전 반차';
      break;
    case '휴가(오후반차)':
      color = 'primary';
      title = '오후 반차';
      break;
    case '휴가(공가)':
      color = 'primary';
      title = '공가';
      break;
    case '지각':
      color = 'secondary';
      title = '지각';
      break;
    case '조퇴':
      color = 'warning';
      title = '조퇴';
      break;
    case '결근':
      color = 'error';
      title = '결근';
  }
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

OrderStatus.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string
};

// ==============================|| ORDER TABLE ||============================== //

export default function UserAttendInfoTable({ data }) {
  // 날짜 형식
  const { dateFormat } = useFormatter();

  return (
    <Box>
      <TableContainer
        sx={{
          overflow: 'auto',
          position: 'relative',
          display: 'block',
          height: `${Object.keys(data).length === 0 ? '47px' : '100px'}`,
          padding: '0px',
          '& td, & th': { whiteSpace: 'nowrap' },
          '&::-webkit-scrollbar': {
            width: 5
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'white'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'gray',
            borderRadius: 2
          }
        }}
      >
        <Table
          stickyHeader
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <OrderTableHead />
          <TableBody>
            <TableRow role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1} key={data.attend_date}>
              {Object.keys(data).length !== 0 && (
                <>
                  <TableCell component="th" scope="data" align="center" sx={{ width: '120px' }}>
                    {dateFormat(new Date(data.attend_date))}
                  </TableCell>
                  <TableCell align="center" sx={{ width: '100px' }}>
                    {data.attend_start ? data.attend_start : '-'}
                  </TableCell>
                  <TableCell align="center" sx={{ width: '100px' }}>
                    {data.attend_end ? data.attend_end : '-'}
                  </TableCell>
                  <TableCell align="center" sx={{ width: '100px' }}>
                    <OrderStatus status={data.attend_status} />
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
