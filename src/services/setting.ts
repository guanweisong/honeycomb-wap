import request from '@/src/utils/request';
import { SettingEntity } from '@/src/types/setting/setting.entity';

export default class SettingServer {
  // 获取网站配置信息
  static indexSetting(): Promise<SettingEntity> {
    console.log('setting=>service=>indexSetting');
    return request({
      url: '/settings',
      method: 'get',
    }).then((result) => result[0]);
  }
}
