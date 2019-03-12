import request from '../utils/request';

export const indexPostList = (params) => {
  console.log('category=>service=>indexPostList');
  return request({
    url: '/posts',
    method: 'get',
    params: params,
  })
};
