import request from '@/src/utils/request';
import { PageEntity } from '@/src/types/page/page.entity';
import { cache } from 'react';

export default class PageServer {
  /**
   * 查询页面详情
   * @param id
   */
  public static indexPageDetail = cache((id: string): Promise<PageEntity> => {
    return request({
      url: `/page/${id}`,
      method: 'get',
    });
  });
}
