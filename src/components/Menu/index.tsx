'use client';

import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface MenuItem {
  label: React.ReactNode;
  link: string;
  isActive: boolean;
  children?: MenuItem[];
}

export interface MenuProps {
  data: MenuItem[];
}

const Menu = (props: MenuProps) => {
  const { data } = props;
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setVisible(false);
  }, [pathname]);

  const renderItem = (data: MenuItem[]) => {
    return (
      <ul
        className={classNames('absolute lg:block lg:static lg:flex py-2 lg:py-0 text-base', {
          'inset-x-0 top-full shadow-md block bg-white dark:bg-gray-900': visible,
          ['hidden']: !visible,
        })}
      >
        {data.map((m) => (
          <li className="lg:relative lg:flex group">
            <Link
              href={m.link}
              className={classNames(
                'lg:relative leading-10 lg:z-20 px-4 lg:px-6 lg:flex lg:items-center',
                {
                  'lg:bg-pink-500 text-pink-500 lg:text-white': m.isActive,
                  'lg:bg-white dark:lg:bg-gray-800 dark:text-gray-500 group-hover:lg:text-pink-500 group-hover:lg:bg-gray-100 dark:group-hover:lg:bg-gray-900':
                    !m.isActive,
                },
              )}
            >
              {m.label}
            </Link>
            {m.children && (
              <ul className="lg:absolute lg:bg-white dark:lg:bg-gray-900 lg:border-t-2 lg:border-pink-700 lg:z-10 lg:top-full lg:left-0 lg:right-0 lg:transition-all lg:-translate-y-full group-hover:lg:translate-y-0 group-hover:lg:shadow-md">
                {m.children.map((n) => (
                  <li>
                    <Link
                      href={n.link}
                      className={classNames(
                        'block leading-10 lg:text-center hover:lg:text-pink-500 px-8 lg:px-0',
                        {
                          'text-pink-500': n.isActive,
                          'dark:text-gray-500': !n.isActive,
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
      <div className="w-10 px-2 cursor-pointer pt-2 lg:hidden" onClick={() => setVisible(!visible)}>
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
