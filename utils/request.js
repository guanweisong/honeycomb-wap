import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '//127.0.0.1:7001' : '//api.guanweisong.com',
  withCredentials: true,
  timeout: 10000,
  headers: {},
});

instance.interceptors.response.use(res=>{
  // console.log('request=>success', res);
  return res.data;
}, err => {
  console.log('request=>err', err);
});

export default instance;
