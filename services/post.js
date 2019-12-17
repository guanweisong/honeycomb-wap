import request from '../utils/request';

export const indexPostList = (params) => {
  console.log('category=>service=>indexPostList');
  return request({
    url: '/posts/list',
    method: 'get',
    params: params,
  })
};

export const indexPostDetail = (params) => {
  console.log('post=>service=>indexPostDetail');
  return request({
    url: `/posts/detail/${params._id}`,
    method: 'get',
  })
}

export const indexRandomPostByCategoryId = (params) => {
  console.log('category=>service=>indexRandomPostByCategoryId');
  return request({
    url: '/posts/list/random',
    method: 'get',
    params: params,
  })
};
