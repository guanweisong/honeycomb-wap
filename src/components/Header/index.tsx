import React from 'react';
import Head from 'next/head';
// @ts-ignore
import listToTree from 'list-to-tree-lite';
import { MenuEntity } from '@/src/types/menu/menu.entity';
import Menu, { MenuItem } from '@/src/components/Menu';
import Link from 'next/link';
import { SettingEntity } from '@/src/types/setting/setting.entity';
import { MenuType } from '@/src/types/menu/MenuType';

export interface HeaderProps {
  title: string | undefined;
  menu: MenuEntity[];
  setting: SettingEntity;
  currentMenu?: string;
}

const Header = (props: HeaderProps) => {
  const { setting, menu, title, currentMenu } = props;

  /**
   * 根据id寻找家族属性集合
   */
  const getCurrentPath = (id: string | undefined, familyProp: string) => {
    const path = [] as string[];
    const { menu } = props;
    if (id) {
      const find = (data: MenuEntity[]) => {
        if (data.length === 1) {
          path.push(data[0][familyProp]);
        } else {
          data.forEach((item) => {
            if (item._id === id) {
              path.push(item[familyProp]);
              if (item.parent !== '0') {
                find(data.filter((m) => m._id === item.parent));
              }
            }
          });
        }
      };
      find(menu);
    }
    return path.reverse();
  };

  const currentPath = getCurrentPath(props.currentMenu, '_id');

  /**
   * 格式化菜单树
   */
  const formatCategorise = () => {
    const menuData = listToTree(menu, { idKey: '_id', parentKey: 'parent' });
    const result = [
      {
        category_title: '首页',
        category_title_en: '',
        isHome: true,
        children: [],
        _id: 'home',
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
        isActive: currentPath.includes(data._id) || (currentPath.length === 0 && data.isHome),
      } as MenuItem;
      if (data.isHome) {
        item.label = data.category_title;
        item.link = '/list/category';
      }
      switch (data.type) {
        case MenuType.PAGE:
          item.label = data.page_title;
          item.link = `/pages/${data._id}`;
          break;
        case MenuType.POST:
          item.label = data.category_title;
          item.link = `/list/category/${getCurrentPath(data._id, 'category_title_en').join('/')}`;
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

  console.log('menuData', menuData);

  return (
    <div className="relative mb-2 lg:mb-4 h-12 lg:h-20 z-50 border-b dark:border-gray-900">
      <Head>
        <title>{title || setting.site_name}</title>
      </Head>
      <div className="container relative box-border h-full flex justify-between items-center">
        <div className="h-full flex items-center">
          <Link href={'/list/category'} scroll={false}>
            <a className="text-pink-500 text-xl lg:text-2xl ml-2">{setting.site_name}</a>
          </Link>
        </div>
        <div className="h-full flex items-center">
          <Menu data={menuDataFormat} />
        </div>
      </div>
    </div>
  );
};

export default Header;
