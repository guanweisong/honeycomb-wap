import React from 'react';
import Head from 'next/head';
import { MenuEntity } from '@/src/types/menu/menu.entity';
import Menu from '@/src/components/Menu';
import Link from 'next/link';
import { SettingEntity } from '@/src/types/setting/setting.entity';

export interface HeaderProps {
  title: string | undefined;
  menu: MenuEntity[];
  setting: SettingEntity;
  currentMenu?: string;
}

const Header = (props: HeaderProps) => {
  const { setting, menu, title, currentMenu } = props;

  return (
    <div className="relative bg-white mb-2 lg:mb-4 h-12 lg:h-20 z-50 border-b">
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
          <Menu menu={menu} currentMenu={currentMenu} />
        </div>
      </div>
    </div>
  );
};

export default Header;
