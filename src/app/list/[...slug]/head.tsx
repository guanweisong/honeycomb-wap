import SettingServer from '@/src/services/setting';
import MenuServer from '@/src/services/menu';
import { MenuEntity } from '@/src/types/menu/menu.entity';

export default async function Head(props: any) {
  const { params } = props;
  const setting = await SettingServer.indexSetting();
  const menu = await MenuServer.indexMenu();

  // 获取列表类型
  const type = typeof params?.slug !== 'undefined' ? params?.slug[0] : undefined;
  let typeName = params?.slug?.pop();
  switch (type) {
    case 'category':
      typeName = menu.find((item: MenuEntity) => item.titleEn === typeName)?.title || '';
      break;
  }

  /**
   * 获取页面标题
   */
  const getTitle = () => {
    let title = '';
    switch (type) {
      case 'tags':
        title = `标签“${typeName}”下的所有文章`;
        break;
      case 'authors':
        title = `作者“${typeName}”下的所有文章`;
        break;
      default:
        title = `${typeName || '首页'}_${setting.siteName}`;
    }
    return title;
  };

  return (
    <>
      <title>{getTitle()}</title>
    </>
  );
}
