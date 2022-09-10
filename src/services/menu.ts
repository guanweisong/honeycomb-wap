import request from '@/src/utils/request';
import { MenuType } from '@/src/types/menu';

export default class MenuServer {
  // 获取菜单列表
  static indexMenu() {
    console.log('menu=>service=>indexMenu');
    return request({
      url: '/menus',
      method: 'get',
    }).then((result) => {
      if (result.data?.list) {
        result.data.list = result.data.list.map((item: MenuType) => ({
          ...item,
          parent: item.parent || '0',
        }));
      }
      return result;
    });
  }
}
