import Taro from '@tarojs/taro';
import { axios } from 'taro-axios';
import { pageToLogin } from './utils';

// 创建新实例  默认配置
const HTTP = axios.create({
  timeout: 50000,
  baseURL: 'http://api.jiushiwangzha.cn',
});
HTTP.interceptors.request.use(
  (request) => {
    Taro.showLoading({
      title: '加载中',
    });
    let token = Taro.getStorageSync('Authorization') || null;
    token && (request.headers['user-token'] = token);
    return request;
  },
  (error) => {
    console.log(error);
  }
);
// 响应回来后做什么
HTTP.interceptors.response.use(
  (response) => {
    Taro.hideLoading();
    const { authorization } = response.headers;
    authorization && Taro.setStorageSync('Authorization', authorization);
    if (response.status === 200) {
      // 请求成功 写token
      if (response.data.code == 401 || response.data.code == 700) {
        Taro.setStorageSync('Authorization', '');
        pageToLogin();
      }
      return response.data;
    } else if (response.status === 500) {
      // response.data = {}
      // response.data.msg = '服务器错误： 500'
    } else if (response.status === 401) {
      // response.data = {}
      // response.data.msg = '您没有权限： 401'
    } else if (response.status === 404) {
      response.data = {};
      // response.data.msg = '请求失败,找不到资源： 404'
    } else {
      return response.data;
      // response.data = {};
      // response.data.msg = '其他原因引其错误'
    }
  },
  (error) => {
    Taro.hideLoading();
    if (error.response) {
      const { status } = error.response;
      if (status == 401 || status == 405) {
        Taro.setStorageSync('Authorization', '');
        pageToLogin();
      }
    }
    return Promise.reject(error.response);
  }
);
export default HTTP;
