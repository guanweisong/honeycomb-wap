import request from '@/src/utils/request';
import { UpdateView } from '@/src/types/view/update.view';

export default class ViewServer {
  // 更新浏览量
  static updateViews(params: UpdateView) {
    console.log('view=>service=>updateViews');
    return request({
      url: `/${params.type}/${params.id}/views`,
      method: 'patch',
    });
  }
}
