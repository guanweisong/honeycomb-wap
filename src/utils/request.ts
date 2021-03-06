import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:7001' : 'https://api.guanweisong.com',
  withCredentials: true,
  timeout: 10000,
  headers: {},
});

instance.interceptors.request.use(config=>{
  console.log('request=>request', config.url, config.params);
  return config;
});

instance.interceptors.response.use(res=>{
  return res;
}, err => {
  console.error('request=>err', err.response.data.error);
});

export default instance;
