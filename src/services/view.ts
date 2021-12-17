import request from '@/src/utils/request';

export interface IViewProps {
  type: 'posts' | 'pages';
  id?: string;
}

export default class ViewServer {
  // 获取浏览量
  static indexViews(params: IViewProps) {
    console.log('view=>service=>indexViews');
    return request({
      url: `/${params.type}/${params.id}/views`,
      method: 'get',
    })
  }
  // 更新浏览量
  static updateViews(params: IViewProps) {
    console.log('view=>service=>updateViews');
    return request({
      url: `/${params.type}/${params.id}/views`,
      method: 'patch',
    })
  }
}
