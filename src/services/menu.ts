import request from '@/src/utils/request';
import { MenuEntity } from '@/src/types/menu/menu.entity';
import PaginationResponse from '@/src/types/pagination.response';
import { cache } from 'react';

export default class MenuServer {
  // 获取菜单列表
  static indexMenu = cache((): Promise<MenuEntity[]> => {
    console.log('menu=>service=>indexMenu');
    // @ts-ignore
    return request<string, PaginationResponse<MenuEntity[]>>({
      url: '/menu',
      method: 'get',
    }).then((result) => {
      if (result.list) {
        return result.list.map((item) => ({
          ...item,
          parent: item.parent ?? '0',
        }));
      }
    });
  });
}
