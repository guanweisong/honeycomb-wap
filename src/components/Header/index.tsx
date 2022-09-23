import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from './index.module.less';
import { MenuType } from '@/src/types/menu';
import Menu from '@/src/components/Menu';
import Link from 'next/link';
import { SettingType } from '@/src/types/setting';

export interface HeaderProps {
  title: string | undefined;
  menu: MenuType[];
  setting: SettingType;
  currentMenu?: string;
}

const Header = (props: HeaderProps) => {
  const { setting, menu, title, currentMenu } = props;

  return (
    <div className={styles.nav}>
      <Head>
        <title>{title || setting.site_name}</title>
      </Head>
      <div className={styles.nav__container}>
        <div className={styles.nav__home}>
          <Link href={'/'}>
            <a>{setting.site_name}</a>
          </Link>
        </div>
        <div className={styles.nav__menu}>
          <Menu menu={menu} currentMenu={currentMenu} />
        </div>
      </div>
    </div>
  );
};

export default Header;
