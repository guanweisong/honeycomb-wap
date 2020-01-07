import request from '@/utils/request';

export const indexSetting = () => {
  console.log('setting=>service=>indexSetting');
  return request({
    url: '/settings',
    method: 'get',
  })
};
