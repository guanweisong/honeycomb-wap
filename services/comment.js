import request from '../utils/request';

export const index = (id) => {
  console.log('comment=>service=>index');
  return request({
    url: `/comments/${id}`,
    method: 'get',
  })
};
export const create = (params) => {
  console.log('comment=>service=>create', params);
  return request({
    url: '/comments',
    method: 'post',
    data: params,
  })
};

