import request from '@/src/utils/request';
import PaginationResponse from '@/src/types/pagination.response';
import { cache } from 'react';
import { LinkEntity } from '@/src/types/link/link.entity';
import { LinkListQuery } from '@/src/types/link/link.list.query';

export default class LinkServer {
  // 获取菜单列表
  static index = cache((params: LinkListQuery): Promise<PaginationResponse<LinkEntity[]>> => {
    console.log('menu=>service=>indexMenu');
    // @ts-ignore
    return request({
      url: '/link',
      method: 'get',
      params,
    });
  });
}
