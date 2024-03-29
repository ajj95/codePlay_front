import React, { useEffect, useState } from 'react';
import ComponentSkeleton from './components-overview/ComponentSkeleton';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '../../node_modules/@mui/material/index';
import BasicContainer from 'components/container/BasicContainer';
import UserAllAttendTable from 'components/Table/UserAllAttendTable';
import BasicChip from 'components/Chip/BasicChip';
import MainCard from 'components/MainCard';
import TimePicker2 from 'components/DatePicker/TimePicker';
import BasicDatePicker from 'components/DatePicker/BasicDatePicker';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import UserAttendInfoTable from 'components/Table/UserAttendInfoTable';
import BasicAuto from 'components/AutoComplete/BasicAuto';
import axios from '../../node_modules/axios/index';
import SelectUserTable from 'components/Table/SelectUserTable';
import ModalM from 'components/Modal/ModalM';
import { jwtDecode } from '../../node_modules/jwt-decode/build/cjs/index';
import SuccessModal from 'components/Modal/SuccessModal';

const ModifyAttendance = () => {
  //token 값을 decode해주는 코드
  const token = jwtDecode(localStorage.getItem('token').slice(7));

  // 근태담당자와 같은 부서인 모든 직원 목록
  useEffect(() => {
    axios.get(`manager-dept-users?user_no=${token.user_no}`).then((res) => {
      setAllUsers(res.data);
    });
  }, []);

  // 수정 성공 모달
  const [successModal, setSuccessModal] = React.useState(false);
  // 모달창 활성화 버튼
  const handleOpenSuccessModal = () => {
    setSuccessModal(true);
    setTimeout(() => {
      setSuccessModal(false);
    }, 1500);
  };
  // 모달창 취소 버튼
  const handleCloseSuccessModal = () => {
    setSuccessModal(false);
    setValue2(2);
    setValue3(2);
    setValue4(2);
  };

  // Tab : 0.출/퇴근 =============================================
  // 부서 전체 사용자 데이터
  const [allUsers, setAllUsers] = useState([]);

  // 사원선택에서 검색한 이름
  const [searchName, setSearchName] = useState('');

  // 사원선택의 자동완성 창에서 검색어 변경(검색) 될 때마다 searchName 설정
  const handleSelectUser = (event, newValue) => {
    setSearchName(newValue);
  };

  // 부서 전체 사용자를 체크박스로 선택하여 체크된 사용자를 담는 배열
  const [checkItems, setCheckItems] = useState([]);

  // 체크박스 단일 선택
  const handleSingleCheck = (checked, user_no) => {
    if (checked) {
      setCheckItems((prev) => [...prev, user_no]); // 단일 선택 시 체크된 아이템을 배열에 추가
    } else {
      setCheckItems(checkItems.filter((el) => el !== user_no)); // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
    }
  };

  // 체크박스 전체 선택
  const handleAllCheck = (checked) => {
    if (checked) {
      const idArray = [];
      allUsers.forEach((el) => idArray.push(el.user_no));
      setCheckItems(idArray);
    } else {
      setCheckItems([]);
    }
  };

  // 체크박스 선택한 사원의 전체 출퇴근 내역을 담는 배열
  const [attendDatas, setAttendDatas] = useState([]);

  // 수정할 출퇴근 날짜 선택
  const [selectDate, setSelectDate] = useState(new Date());

  const searchSelectDate = async () => {
    if (checkItems.length === 1) {
      try {
        const response = await axios.get(
          `/user-attend-date?user_no=${checkItems[0]}&date=${new Date(selectDate).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })}`
        );
        console.log(response.data);
        setSelectAttendData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  // 수정할 출퇴근 날짜의 데이터
  const [selectAttendData, setSelectAttendData] = useState({});

  // 출퇴근 전체조회 모달창
  const [openAll, setOpenAll] = React.useState(false);

  // 출퇴근 전체조회 모달창 열기 버튼
  const handleOpenAll = () => {
    if (checkItems.length === 1) {
      setSelectAttendData(
        axios.get(`/user-attend?user_no=${checkItems[0]}`).then((res) => {
          setAttendDatas(res.data);
        })
      );
      setOpenAll(true);
    } else {
      alert('조회할 사원 선택해주세욤');
    }
  };

  // 출퇴근 전체조회 모달창 취소 버튼 (데이터 저장 O)
  const handleCloseAllSave = () => {
    setOpenAll(false);
    setSelectAttendData(searchAttendData);
    setSearchStartDate(new Date().setHours(0, 0, 0, 0));
    setSearchEndDate(new Date().setHours(0, 0, 0, 0));
    setAttendDatas([]);
  };

  // 출퇴근 전체조회 모달창 확인 버튼 (데이터 저장 X)
  const handleCloseAll = () => {
    setOpenAll(false);
    setSearchAttendData({});
    setSearchStartDate(new Date().setHours(0, 0, 0, 0));
    setSearchEndDate(new Date().setHours(0, 0, 0, 0));
    setAttendDatas([]);
  };

  // 출퇴근 전체조회 모달창 : 날짜 검색 시작일
  const [searchStartDate, setSearchStartDate] = useState(new Date().setHours(0, 0, 0, 0));
  // 출퇴근 전체조회 모달창 : 날짜 검색 종료일
  const [searchEndDate, setSearchEndDate] = useState(new Date().setHours(0, 0, 0, 0));
  // 출퇴근 전체조회 모달창에서 선택한 출/퇴근 데이터 값
  const [searchAttendData, setSearchAttendData] = useState({});

  // 출퇴근 수정 사항 체크 박스
  const [startChecked, setStartChecked] = useState(true); // 출근 default : true
  const [endChecked, setEndChecked] = useState(false); // 퇴근 default : false
  const handleStartChange = (e) => {
    setStartChecked(e.target.checked);
  };

  const handleEndChange = (e) => {
    setEndChecked(e.target.checked);
  };

  // 출퇴근 수정시간 수정 요청 시 라디오
  const [attendStartDefault, setAttendStartDefault] = useState('default'); // 출근수정시간
  const handleDefaultStartChange = (event) => {
    setAttendStartDefault(event.target.value);
    if (event.target.value === 'default') {
      setUpdateStartTime('09:00:00');
    }
  };

  // 수정 제목, 사유
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');

  // 퇴근 수정 요청 시 라디오 : 수정시간 기본값/직접입력 선택
  const [attendEndDefault, setAttendEndDefault] = useState('default'); // 퇴근수정시간
  const handleDefaultEndChange = (event) => {
    setAttendEndDefault(event.target.value);
    if (event.target.value === 'default') {
      setUpdateEndTime('18:00:00');
    }
  };

  // 출퇴근 수정할 시간 선택
  const [updateStartTime, setUpdateStartTime] = useState('09:00:00'); // 출근 : 수정할 시간
  const [updateEndTime, setUpdateEndTime] = useState('18:00:00'); // 퇴근 : 수정할 시간

  // 선택한 출퇴근 날짜 데이터가 바뀔 경우 작성중인 수정 내용 초기화
  useEffect(() => {
    if (Object.keys(selectAttendData).length !== 0) {
      setAttendStartDefault('default');
      setAttendEndDefault('default');
      setUpdateStartTime('09:00:00');
      setUpdateEndTime('18:00:00');
      setSelectDate(new Date(selectAttendData.attend_date));
    }
  }, [selectAttendData]);

  // 체크한 사용자가 바뀔 때마다 작성중인 수정 내용 초기화
  useEffect(() => {
    // 여러명의 사원 체크할 경우 작성중인 수정 내용 초기화 되지 않게 조건문 사용
    if (checkItems.length < 2) {
      setAttendStartDefault('default');
      setAttendEndDefault('default');
      setUpdateStartTime('09:00:00');
      setUpdateEndTime('18:00:00');
      setSelectDate(new Date().setHours(0, 0, 0, 0));
      setSelectAttendData({});
    }
  }, [checkItems]);

  function submitAttendModify() {
    console.log(checkItems);
    console.log(selectDate);
    console.log(new Date(selectDate));
    axios
      .patch(`/manager-attend-modify`, {
        user_no_list: checkItems,
        attend_date: new Date(selectDate).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        attendedit_title: title,
        attendedit_kind: startChecked === true && endChecked === false ? 3 : startChecked === false && endChecked === true ? 4 : 5,
        attendedit_start_time: startChecked === true ? updateStartTime : '',
        attendedit_end_time: endChecked === true ? updateEndTime : '',
        attendapp_user_no: token.user_no,
        attendapp_status: 3,
        attendapp_reason: reason
      })
      .then((res) => {
        console.log('결재완료 : ' + res.data);
        handleOpenSuccessModal();
        setCheckItems([]);
      });
  }

  return (
    <ComponentSkeleton>
      <Box clone mx={1}>
        <BasicContainer>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4">근태 현황 수정</Typography>
            </Grid>
          </Grid>
          <Box mt={2} ml={1}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={4} md={4} lg={4}>
                <MainCard sx={{ pt: 2, mr: 1, height: '730px', borderRadius: 0 }} content={false}>
                  <Box
                    pr={2}
                    pl={2}
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <BasicChip label="사원선택" color="#46a5f3" />
                    {/* 자동완성 부분 */}
                    <BasicAuto
                      label="이름"
                      datas={allUsers}
                      handleSelectUser={handleSelectUser}
                      searchName={searchName}
                      setSearchName={setSearchName}
                    />
                  </Box>
                  <SelectUserTable
                    datas={allUsers}
                    searchName={searchName}
                    handleAllCheck={handleAllCheck}
                    handleSingleCheck={handleSingleCheck}
                    checkItems={checkItems}
                  />
                </MainCard>
              </Grid>
              <Grid item xs={8} md={8} lg={8}>
                {checkItems.length > 1 && (
                  <MainCard sx={{ pt: 2, pr: 2, pl: 2, height: '740px' }} content={false}>
                    <Grid container spacing={1} justifyContent="center">
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="h4">일괄 출/퇴근 수정</Typography>
                        <Box clone mt={2.5}>
                          <BasicChip label="변경 날짜" color="#46a5f3" />
                          <BasicDatePicker setDate={setSelectDate} val={selectDate} width="22%" />
                        </Box>
                        <Box clone mt={2.5}>
                          <BasicChip label="수정사항" color="#46a5f3" />
                          <Checkbox size="small" checked={startChecked} onChange={handleStartChange} /> 출근
                          <Checkbox size="small" checked={endChecked} onChange={handleEndChange} /> 퇴근
                        </Box>
                        {startChecked === true && (
                          <Box clone mt={2.5}>
                            <BasicChip label="출근수정시간" color="#46a5f3" />
                            <FormControl sx={{ ml: 1 }}>
                              <RadioGroup
                                row
                                sx={{ justifyContent: 'center', alignItems: 'center' }}
                                value={attendStartDefault}
                                onChange={handleDefaultStartChange}
                              >
                                <FormControlLabel value="default" control={<Radio size="small" />} label="기본값" />
                                <FormControlLabel value="other" control={<Radio size="small" />} label="직접입력" />
                              </RadioGroup>
                            </FormControl>
                            {attendStartDefault == 'other' && <TimePicker2 label={'출근수정시간'} setTime={setUpdateStartTime} />}
                          </Box>
                        )}
                        {endChecked === true && (
                          <Box clone mt={2.5}>
                            <BasicChip label="퇴근수정시간" color="#46a5f3" />
                            <FormControl sx={{ ml: 1 }}>
                              <RadioGroup
                                row
                                sx={{ justifyContent: 'center', alignItems: 'center' }}
                                value={attendEndDefault}
                                onChange={handleDefaultEndChange}
                              >
                                <FormControlLabel value="default" control={<Radio size="small" />} label="기본값" />
                                <FormControlLabel value="other" control={<Radio size="small" />} label="직접입력" />
                              </RadioGroup>
                            </FormControl>
                            {attendEndDefault == 'other' && <TimePicker2 label={'퇴근수정시간'} setTime={setUpdateEndTime} />}
                          </Box>
                        )}
                        <Box clone mt={2.5} mr={1}>
                          <BasicChip label="수정사유" color="#46a5f3" />
                          <TextField multiline rows={5} sx={{ width: '84%' }} />
                        </Box>
                        <Stack direction="row" justifyContent="flex-end" mt={2} mr={1.5}>
                          <Button variant="contained" onClick={submitAttendModify}>
                            수정완료
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </MainCard>
                )}
                {checkItems.length <= 1 && (
                  <>
                    <MainCard sx={{ mb: 1, pt: 2, height: '230px', borderRadius: 0 }} content={false}>
                      <Grid container alignItems="center" direction="row" spacing={1} sx={{ pl: 2 }}>
                        <Grid item xs={1.5} md={1.5} lg={1.5}>
                          <Typography variant="h5">날짜 선택</Typography>
                        </Grid>
                        <Grid item xs={3} md={3} lg={3}>
                          <BasicDatePicker setDate={setSelectDate} val={selectDate} />
                        </Grid>
                        <Grid item xs={2} md={2} lg={2}>
                          <Button variant="contained" onClick={searchSelectDate}>
                            검색
                          </Button>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4}></Grid>
                        <Grid item xs={1.5} md={1.5} lg={1.5}>
                          <Button variant="contained" onClick={handleOpenAll}>
                            전체 조회
                          </Button>
                        </Grid>
                      </Grid>
                      <Box clone mt={3}>
                        <UserAttendInfoTable data={selectAttendData} />
                        {Object.keys(selectAttendData).length === 0 && (
                          <Box
                            p={1}
                            sx={{
                              display: 'flex',
                              justifyContent: 'center', // 수평 중앙 정렬
                              alignItems: 'center' // 수직 중앙 정렬
                            }}
                          >
                            <ErrorOutlineIcon fontSize="medium" color="secondary" sx={{ mx: 1 }} />
                            <Typography size="small" color="secondary">
                              선택된 날짜 없음
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </MainCard>
                    <MainCard sx={{ pt: 2, pr: 2, pl: 2, height: '490px', borderRadius: 0 }} content={false}>
                      <Grid container spacing={1} justifyContent="center">
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                          <Typography variant="h4">출/퇴근 수정</Typography>
                          <Box clone mt={2.5}>
                            <BasicChip label="제목" color="#46a5f3" />
                            <TextField
                              size="small"
                              onChange={(e) => {
                                setTitle(e.target.value);
                              }}
                            />
                          </Box>
                          <Box clone mt={2.5}>
                            <BasicChip label="수정사항" color="#46a5f3" />
                            <Checkbox size="small" checked={startChecked} onChange={handleStartChange} /> 출근
                            <Checkbox size="small" checked={endChecked} onChange={handleEndChange} /> 퇴근
                          </Box>
                          {startChecked === true && (
                            <Box clone mt={2.5}>
                              <BasicChip label="출근수정시간" color="#46a5f3" />
                              <FormControl sx={{ ml: 1 }}>
                                <RadioGroup
                                  row
                                  sx={{ justifyContent: 'center', alignItems: 'center' }}
                                  value={attendStartDefault}
                                  onChange={handleDefaultStartChange}
                                >
                                  <FormControlLabel value="default" control={<Radio size="small" />} label="기본값" />
                                  <FormControlLabel value="other" control={<Radio size="small" />} label="직접입력" />
                                </RadioGroup>
                              </FormControl>
                              {attendStartDefault == 'other' && <TimePicker2 label={'출근수정시간'} setTime={setUpdateStartTime} />}
                            </Box>
                          )}
                          {endChecked === true && (
                            <Box clone mt={2.5}>
                              <BasicChip label="퇴근수정시간" color="#46a5f3" />
                              <FormControl sx={{ ml: 1 }}>
                                <RadioGroup
                                  row
                                  sx={{ justifyContent: 'center', alignItems: 'center' }}
                                  value={attendEndDefault}
                                  onChange={handleDefaultEndChange}
                                >
                                  <FormControlLabel value="default" control={<Radio size="small" />} label="기본값" />
                                  <FormControlLabel value="other" control={<Radio size="small" />} label="직접입력" />
                                </RadioGroup>
                              </FormControl>
                              {attendEndDefault == 'other' && <TimePicker2 label={'퇴근수정시간'} setTime={setUpdateEndTime} />}
                            </Box>
                          )}
                          <Box clone mt={2.5} mr={1}>
                            <BasicChip label="수정사유" color="#46a5f3" />
                            <TextField
                              multiline
                              rows={5}
                              sx={{ width: '84%' }}
                              onChange={(e) => {
                                setReason(e.target.value);
                              }}
                            />
                          </Box>
                          <Stack direction="row" justifyContent="flex-end" mt={2} mr={3}>
                            <Button variant="contained" onClick={submitAttendModify}>
                              수정완료
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </MainCard>
                  </>
                )}
                <SuccessModal open={successModal} handleClose={handleCloseSuccessModal} color="#46a5f3" msg="수정 완료되었습니다." />

                <ModalM open={openAll} handleClose={handleCloseAll}>
                  <Grid container alignItems="center" direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={3.5} md={3.5} lg={4}>
                      <Typography variant="h5">전체 근태 내역</Typography>
                    </Grid>
                    <Grid item xs={3.5} md={3.5} lg={3.5}>
                      <BasicDatePicker setDate={setSearchStartDate} val={searchStartDate} />
                    </Grid>
                    <Grid item xs={3.5} md={3.5} lg={3.5}>
                      <BasicDatePicker setDate={setSearchEndDate} val={searchEndDate} />
                    </Grid>
                    <Grid item xs={1.5} md={1.5} lg={1}>
                      <Button variant="contained">검색</Button>
                    </Grid>
                  </Grid>
                  <UserAllAttendTable
                    datas={attendDatas.filter((data) => data.attend_status !== '초과')}
                    handleMyCard={setSearchAttendData}
                    height={'470px'}
                  />
                  <Grid container justifyContent="right" spacing={1} sx={{ mt: 2 }}>
                    <Grid item>
                      <Button variant="contained" size="medium" onClick={handleCloseAll}>
                        취소
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" size="medium" onClick={handleCloseAllSave}>
                        확인
                      </Button>
                    </Grid>
                  </Grid>
                </ModalM>
              </Grid>
            </Grid>
          </Box>
        </BasicContainer>
      </Box>
    </ComponentSkeleton>
  );
};

export default ModifyAttendance;
