import React from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import { SettingEntity } from '@/src/types/setting/setting.entity';
import { MenuEntity } from '@/src/types/menu/menu.entity';

export interface LayoutProps {
  title: string | undefined;
  menu: MenuEntity[];
  currentMenu?: string;
  setting: SettingEntity;
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children, title, setting, menu, currentMenu } = props;
  return (
    <div className="min-h-full">
      <Header title={title} setting={setting} menu={menu} currentMenu={currentMenu} />
      <div className={'container px-2'}>{children}</div>
      <Footer setting={setting} />
    </div>
  );
};

export default Layout;
