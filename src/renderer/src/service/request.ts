
import { message } from 'antd';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';


export const instance = axios.create({
  baseURL: ``,
});

const request = async <T>(config: AxiosRequestConfig) => {
  const { data } = await instance.request<T>(config);
  return data;
};

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  function (response) {
    const { data } = response;
    const code = data.code;
    if (code === 999999 || code === '999999') {
      message.error(data.msg);
    }
    return response;
  },
  function (error) {
    if (error.response.status === 404) {
      message.error('请求的资源不存在');
    } else {
      console.log(error);
      message.error('请求出错：' + error.message);
    }
    return Promise.reject(error);
  },
);
export default request;
