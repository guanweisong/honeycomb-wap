import request from '@/src/utils/request';

export interface IViewProps {
  type: 'post' | 'page';
  id?: string;
}

export default class ViewServer {
  // 获取浏览量
  static indexViews(params: IViewProps) {
    console.log('view=>service=>indexViews');
    return request({
      url: `/views/${params.type}/${params.id}`,
      method: 'get',
    })
  }
  // 更新浏览量
  static updateViews(params: IViewProps) {
    console.log('view=>service=>updateViews');
    return request({
      url: `/views/${params.type}/${params.id}`,
      method: 'patch',
    })
  }
}
