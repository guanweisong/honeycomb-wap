import request from '@/src/utils/request';

export interface IIndexTagListParamsType {
  page?: number;
  limit?: number;
  keyword?: string;
}

export default class TagServer {
  // 获取标签列表
  static indexList(params: IIndexTagListParamsType) {
    console.log('category=>service=>indexTagList');
    return request({
      url: '/tags',
      method: 'get',
      params: params,
    })
  }
}
