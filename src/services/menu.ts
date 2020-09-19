import request from '@/src/utils/request';

export default class MenuServer {
  // 获取菜单列表
  static indexMenu() {
    console.log('menu=>service=>indexMenu');
    return request({
      url: '/menus',
      method: 'get',
    })
  }
}
