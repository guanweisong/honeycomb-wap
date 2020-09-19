import request from '@/src/utils/request';

export interface IIndexPostListParamsType {
  category_id?: string;
  post_status?: number [];
  page?: number;
  limit?: number;
  tag_name?: string;
  user_name?: string;
  firstCategory?: string;
  secondCategory?: string;
  asPath?: string;
}

export interface IIndexRandomPostListParamsType {
  number?: number;
  post_category: string
}

export default class PostServer {
  // 获取文章列表
  static indexPostList(params: IIndexPostListParamsType) {
    console.log('category=>service=>indexPostList');
    return request({
      url: '/posts/list',
      method: 'get',
      params: params,
    })
  }

  // 获取文章详情
  static indexPostDetail(id: string) {
    console.log('post=>service=>indexPostDetail');
    return request({
      url: `/posts/detail/${id}`,
      method: 'get',
    })
  }

  // 获取随机文章列表
  static indexRandomPostByCategoryId(params: IIndexRandomPostListParamsType) {
    console.log('category=>service=>indexRandomPostByCategoryId');
    return request({
      url: '/posts/list/random',
      method: 'get',
      params: params,
    })
  }
}
