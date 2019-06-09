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
  console.log('request=>success', res.data);
  return res.data;
}, err => {
  console.log('request=>err', err);
});

export default instance;
