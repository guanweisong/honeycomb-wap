'use client';

import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useClickAway } from 'ahooks';
import { usePathname, useSelectedLayoutSegments } from 'next/navigation';
import PostServer from '@/src/services/post';
import { MenuEntity } from '@/src/types/menu/menu.entity';
import getCurrentPathOfMenu from '@/src/utils/getCurrentPathOfMenu';

export interface MenuItem {
  label: React.ReactNode;
  link: unknown;
  children?: MenuItem[];
}

export interface MenuProps {
  data: MenuItem[];
  flatMenuData: MenuEntity[];
}

const Menu = (props: MenuProps) => {
  const { data, flatMenuData } = props;
  const ref1 = useRef<HTMLUListElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string[]>([]);

  const pathname = usePathname();
  const segments = useSelectedLayoutSegments();

  useEffect(() => {
    setVisible(false);
    judgeCurrentMenu();
  }, [pathname]);

  useClickAway(() => {
    setVisible(false);
  }, [ref1, ref2]);

  /**
   * 计算当前菜单值
   */
  const judgeCurrentMenu = async () => {
    let allCategoryPath = `/${segments.join('/')}`;
    switch (segments[0]) {
      case 'archives':
        const postDetail = await PostServer.indexPostCategoryId(segments[1]);
        allCategoryPath = `/list/category/${getCurrentPathOfMenu({
          id: postDetail.categoryId,
          familyProp: 'titleEn',
          menu: flatMenuData,
        }).join('/')}`;
        setCurrentCategory([allCategoryPath.split('/').slice(0, 4).join('/'), allCategoryPath]);
        break;
      case 'list':
        setCurrentCategory([allCategoryPath.split('/').slice(0, 4).join('/'), allCategoryPath]);
        break;
      default:
        setCurrentCategory([allCategoryPath]);
    }
  };

  const renderItem = (data: MenuItem[]) => {
    return (
      <ul
        className={classNames('absolute lg:static lg:flex py-2 lg:py-0 text-base', {
          'inset-x-0 top-full shadow-md bg-white/95 dark:bg-gray-900/95': visible,
          ['hidden']: !visible,
        })}
        ref={ref1}
      >
        {data.map((m) => (
          <li className="lg:relative lg:flex group">
            <Link
              href={m.link ?? ''}
              className={classNames(
                'lg:relative leading-10 lg:z-20 px-4 lg:px-6 lg:flex lg:items-center',
                {
                  'lg:bg-pink-500 text-pink-500 lg:text-white': m.link === currentCategory[0],
                  'dark:text-gray-500 group-hover:lg:text-pink-500 group-hover:lg:bg-gray-100 dark:group-hover:lg:bg-gray-900':
                    m.link !== currentCategory[0],
                },
              )}
            >
              {m.label}
            </Link>
            {m.children && (
              <ul className="lg:absolute ml-4 lg:ml-0 lg:opacity-0 lg:bg-white dark:lg:bg-gray-900 lg:border-t-2 lg:border-pink-700 lg:z-10 lg:top-full lg:left-0 lg:right-0 lg:transition-all lg:-translate-y-full group-hover:lg:translate-y-0 group-hover:lg:shadow-md group-hover:lg:opacity-100">
                {m.children.map((n) => (
                  <li className="inline-block lg:block">
                    <Link
                      href={n.link ?? ''}
                      className={classNames(
                        'block leading-10 lg:text-center hover:lg:text-pink-500 px-4 lg:px-0',
                        {
                          'text-pink-500': n.link === currentCategory[1],
                          'dark:text-gray-500': n.link !== currentCategory[1],
                        },
                      )}
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };
  return (
    <div className="flex h-full">
      <div
        ref={ref2}
        className="w-10 px-2 cursor-pointer pt-2 lg:hidden"
        onClick={() => setVisible(!visible)}
      >
        {Array.from(new Array(3)).map(() => (
          <div
            className={classNames('h-0.5 my-1.5 bg-gray-500 transition-all', {
              'first:translate-y-2 first:rotate-45 even:opacity-0 last:-translate-y-2 last:-rotate-45':
                visible,
            })}
          />
        ))}
      </div>
      {renderItem(data)}
    </div>
  );
};

export default Menu;
