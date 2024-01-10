import { MetadataRoute } from 'next';
import SettingServer from '@/src/services/setting';
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const setting = await SettingServer.indexSetting();
  return {
    name: setting.siteName.zh,
    short_name: setting.siteName.zh,
    description: setting.siteSubName.zh,
    background_color: '#FFFFFF',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    icons: [
      {
        src: '/static/images/logo.192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/static/images/logo.384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/static/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
