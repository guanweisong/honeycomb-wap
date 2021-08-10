import React, {useState, useRef, useEffect} from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from "./index.module.scss"
import { MenuType } from "@/src/types/menu"
import Menu from "@/src/components/Menu"
import Link from 'next/link'
import { SettingType } from "@/src/types/setting"
import { useClickAway } from 'ahooks'
import { PlatformType } from "@/src/types/platform"

export interface HeaderProps {
  title: string | undefined
  menu: MenuType []
  setting: SettingType
  currentMenu?: string
  platform: PlatformType
}

const Header = (props: HeaderProps) => {
  const { setting, menu, title, currentMenu } = props
  const router = useRouter()
  const ref = useRef<any>()
  const [showMenu, setShowMenu] = useState(false)

  /**
   * 点击空白处关闭菜单
   */
  useClickAway(() => {
    setShowMenu(false)
  }, ref)

  /**
   * 路由变化关闭菜单
   */
  useEffect(() => {
    setShowMenu(false)
  }, [router.asPath])

  /**
   * 返回按钮事件
   */
  const handleClickLeft = () => {
    router.back();
  };

  /**
   * 菜单展开事件
   */
  const toggleMenu = () => {
    setShowMenu(!showMenu)
  };

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
          <Menu
            menu={menu}
            currentMenu={currentMenu}
            visible={showMenu}
          />
        </div>
      </div>
    </div>
  )
}

export default Header;
