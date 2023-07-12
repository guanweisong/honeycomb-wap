// @ts-ignore
import listToTree from 'list-to-tree-lite';
import { MenuEntity } from '@/src/types/menu/menu.entity';
import Menu, { MenuItem } from '@/src/components/Menu';
import Link from 'next/link';
import { MenuType } from '@/src/types/menu/MenuType';
import SettingServer from '@/src/services/setting';
import MenuServer from '@/src/services/menu';
import { SettingEntity } from '@/src/types/setting/setting.entity';
import getCurrentPathOfMenu from '@/src/utils/getCurrentPathOfMenu';

export default async function Header() {
  const promise = [];
  promise.push(SettingServer.indexSetting());
  promise.push(MenuServer.indexMenu());
  const [setting, menu] = (await Promise.all(promise)) as [SettingEntity, MenuEntity[]];

  /**
   * 格式化菜单树
   */
  const formatCategorise = () => {
    const menuData = listToTree(menu, { idKey: 'id', parentKey: 'parent' });
    const result = [
      {
        title: '首页',
        titleEn: '',
        isHome: true,
        children: [],
        id: 'home',
      },
    ];
    return [...result, ...menuData];
  };

  const menuData = formatCategorise();

  /**
   * 拼接菜单数据
   */
  const getMenuData = () => {
    const result: MenuItem[] = [];
    const getItem = (data: MenuEntity) => {
      const item = {
        label: data.title,
      } as MenuItem;
      if (data.isHome) {
        item.link = '/list/category';
      }
      switch (data.type) {
        case MenuType.PAGE:
          item.link = `/pages/${data.id}`;
          break;
        case MenuType.CATEGORY:
          item.link = `/list/category/${getCurrentPathOfMenu({
            id: data.id,
            familyProp: 'titleEn',
            menu,
          }).join('/')}`;
          break;
      }
      if (data.children?.length) {
        item.children = data.children.map((m) => getItem(m));
      }
      return item;
    };
    menuData.forEach((item) => {
      result.push(getItem(item));
    });
    return result;
  };

  const menuDataFormat = getMenuData();

  return (
    <div className="relative mb-2 lg:mb-4 h-12 lg:h-20 z-50 border-b dark:border-gray-900">
      <div className="container relative box-border h-full flex justify-between items-center">
        <div className="h-full flex items-center">
          <Link
            href={'/list/category'}
            scroll={false}
            className="text-pink-500 text-xl lg:text-2xl ml-2"
          >
            {setting.siteName}
          </Link>
        </div>
        <div className="h-full flex items-center">
          <Menu data={menuDataFormat} flatMenuData={menu} />
        </div>
      </div>
    </div>
  );
}
