import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from '../../../node_modules/axios/index';

// material-ui
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// third-party
import { Avatar, Button, Pagination, Stack } from '../../../node_modules/@mui/material/index';

// zusthand
import { useCriteria, useUserTableListState } from 'store/module';

// TODO:정렬 구현하기
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: 'profileImage',
    align: 'left',
    disablePadding: false,
    label: '프로필사진'
  },
  {
    id: 'dept',
    align: 'left',
    disablePadding: false,
    label: '부서명'
  },
  {
    id: 'name',
    align: 'right',
    disablePadding: true,
    label: '이름'
  },
  {
    id: 'position',
    align: 'left',
    disablePadding: false,
    label: '직책'
  },
  {
    id: 'brith',
    align: 'right',
    disablePadding: false,
    label: '생년월일'
  },
  {
    id: 'button',
    align: 'center',
    disablePadding: false,
    label: '버튼'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable() {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;
  const { tableContentList, setTableList } = useUserTableListState();
  const { now_page, setPage, limit, search } = useCriteria();

  async function search_user(search, now_page, limit) {
    const result = await axios.get(`http://localhost:8000/get_query_user?name=${search}&_page=${now_page}&_limit=${limit}`);
    setTableList(result.data);
  }

  return (
    <>
      <Box>
        <TableContainer
          sx={{
            width: '100%',
            overflowX: 'auto',
            position: 'relative',
            display: 'block',
            maxWidth: '100%',
            '& td, & th': { whiteSpace: 'nowrap' }
          }}
        >
          <Table
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
            <OrderTableHead order={order} orderBy={orderBy} />
            <TableBody>
              {Object.keys(tableContentList).length > 0 &&
                stableSort(tableContentList, getComparator(order, orderBy)).map((row, index) => {
                  const isItemSelected = isSelected(row.trackingNo);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.trackingNo}
                      selected={isItemSelected}
                    >
                      <TableCell component="th" id={labelId} scope="row" align="center">
                        <Avatar src={row.profile_url} sx={{ width: 50, height: 50, margin: 'auto' }}></Avatar>
                      </TableCell>
                      <TableCell align="center">{row.dept}</TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.position}</TableCell>
                      <TableCell align="center">{row.date_of_birth}</TableCell>
                      <TableCell align="center">
                        <Button> 사용자 정보 변경</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Stack alignItems="center" mt={2}>
        {/* count의 경우 조회한 데이터의 갯수를 불러올수 있을때 변경 */}
        <Pagination
          count={5}
          page={now_page}
          onChange={(event, page) => {
            setPage(page);
            search_user(search, page, limit);
          }}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </>
  );
}
