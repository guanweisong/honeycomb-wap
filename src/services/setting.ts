import request from '@/src/utils/request';

export default class SettingServer {
  // 获取网站配置信息
  static indexSetting() {
    console.log('setting=>service=>indexSetting');
    return request({
      url: '/settings',
      method: 'get',
    })
  };
}
