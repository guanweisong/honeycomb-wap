import request from '../utils/request';

export const indexMenu = () => {
  console.log('menu=>service=>indexMenu');
  return request({
    url: '/categories',
    method: 'get',
  })
};
