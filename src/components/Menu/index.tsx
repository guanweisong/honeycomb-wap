import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
// @ts-ignore
import listToTree from 'list-to-tree-lite';
import { MenuEntity } from '@/src/types/menu/menu.entity';
import { useRouter } from 'next/router';

interface MenuProps {
  menu: MenuEntity[];
  currentMenu?: string;
}

const Menu = (props: MenuProps) => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  /**
   * 路由变化则关闭菜单
   */
  useEffect(() => {
    setVisible(false);
  }, [router.asPath]);

  const formatCategorise = () => {
    const menuData = listToTree(props.menu, { idKey: '_id', parentKey: 'parent' });
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

  const data = formatCategorise();

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
   * 渲染菜单
   */
  const renderMenu = () => {
    /**
     * 获取菜单的URL
     * @param item
     */
    const getUrl = (item: MenuEntity) => {
      let url = '';
      if (item.isHome) {
        url = '/list/category';
      } else {
        switch (item.type) {
          case 0:
            url = `/list/category/${getCurrentPath(item._id, 'category_title_en').join('/')}`;
            break;
          case 1:
            url = `/pages/${item._id}`;
            break;
        }
      }
      return url;
    };
    /**
     * 获取菜单的标题
     * @param item
     */
    const renderTitle = (item: MenuEntity) => {
      return (
        <Link href={getUrl(item)}>
          <a
            className={classNames(
              'block box-border w-full h-full flex items-center px-5 z-20 bg-white relative lg:group-hover:text-pink-500 lg:group-hover:bg-gray-100',
              {
                ['text-pink-500 lg:bg-pink-500 lg:text-white lg:group-hover:text-white lg:group-hover:bg-pink-500']:
                  currentPath.includes(item._id) || (currentPath.length === 0 && item.isHome),
              },
            )}
          >
            {item.category_title || item.page_title}
          </a>
        </Link>
      );
    };
    /**
     * 渲染菜单
     * @param data
     */
    const renderUnit = (data: MenuEntity[]) => {
      return data.map((item) => {
        if (item.children.length === 0) {
          return (
            <li
              key={item._id}
              className="relative leading-10 lg:flex items-center cursor-pointer lg:h-full group"
            >
              {renderTitle(item)}
            </li>
          );
        } else {
          return (
            <li
              key={item._id}
              className="relative leading-10 lg:flex items-center cursor-pointer lg:h-full group lg:hover:bg-gray-100"
            >
              {renderTitle(item)}
              <ul className="pl-4 lg:pl-0 lg:absolute transition-all bg-white z-10 left-0 right-0 lg:top-full lg:-translate-y-full lg:group-hover:translate-y-0 lg:group-hover:shadow lg:border-t-2 lg:border-pink-700">
                {renderUnit(item.children)}
              </ul>
            </li>
          );
        }
      });
    };
    return renderUnit(data);
  };

  return (
    <div className="h-full flex items-center">
      <div className="w-11 px-2 cursor-pointer lg:hidden" onClick={() => setVisible(!visible)}>
        {[1, 1, 1].map(() => (
          <div
            className={classNames('h-0.5 my-1.5 bg-gray-600 transition-all', {
              'first:translate-y-2 first:rotate-45 even:opacity-0 last:-translate-y-2 last:-rotate-45':
                visible,
            })}
          />
        ))}
      </div>
      <ul
        className={classNames(
          'absolute lg:relative lg:flex -translate-y-full lg:-translate-y-0 lg:h-full lg:items-center',
          {
            ['inset-x-0 top-full translate-y-0 shadow-md']: visible,
            ['hidden']: !visible,
          },
        )}
      >
        {renderMenu()}
      </ul>
    </div>
  );
};

export default Menu;
