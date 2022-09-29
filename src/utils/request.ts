import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_DOMAIN,
  withCredentials: true,
  timeout: 10000,
  headers: {},
});

instance.interceptors.request.use((config) => {
  console.log('request=>request', config.url, config.params);
  return config;
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.error('request=>err', err);
  },
);

export default instance;
