import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.guanweisong.com',
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
