import HTTP from './axios';

//登录
export const getLogin = (params) => {
  return HTTP.post('/api/login', params);
};

//场次
export const getSession = () => {
  return HTTP.get(`/api/index`);
};

//抽奖首页
export const getHome = (params) => {
  return HTTP.get('/api/drawIndex', { params });
};

//中奖列表
export const getDrawRecord = (params) => {
  return HTTP.get('/api/getDrawRecord', { params });
};

//抽奖
export const drawLottery = (params) => {
  return HTTP.get('/api/draw', { params });
};
