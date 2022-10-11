import request from '@/src/utils/request';
import { PageEntity } from '@/src/types/page/page.entity';

export default class PageServer {
  /**
   * 查询页面详情
   * @param id
   */
  public static indexPageDetail(id: string): Promise<PageEntity> {
    return request({
      url: `/pages/${id}`,
      method: 'get',
    });
  }
}
