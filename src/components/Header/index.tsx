import React, {useState, useRef, useEffect} from 'react'
import { NavBar, Icon } from 'antd-mobile'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from "./index.less"
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
  const { setting, menu, title, currentMenu, platform } = props
  const router = useRouter()
  const ref = useRef<any>()
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    setShowMenu(platform.isPC)
  }, [platform.isPC])

  /**
   * 点击空白处关闭菜单
   */
  useClickAway(() => {
    !platform.isPC && setShowMenu(false)
  }, ref)

  /**
   * 路由变化关闭菜单
   */
  useEffect(() => {
    !platform.isPC && setShowMenu(false)
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
    <div ref={ref} className={styles.nav__wrap}>
      <Choose>
        <When condition={ platform.isPC }>
          <NavBar
            mode="light"
            className={styles.nav}
            icon={<h2 className={styles.nav__home}><Link href={'/'}>{setting.site_name}</Link></h2>}
            rightContent={[
              <Menu
                menu={menu}
                currentMenu={currentMenu}
                visible={showMenu}
              />
            ]}
          >
          </NavBar>
        </When>
        <Otherwise>
          <NavBar
            mode="light"
            icon={<Icon type="left" color="#666"/>}
            onLeftClick={handleClickLeft}
            className={styles.nav}
            rightContent={[
              <Icon key="1" color="#666" type="ellipsis" onClick={toggleMenu}/>,
            ]}
          >
            {title || setting.site_name}
          </NavBar>
          <Menu
            menu={menu}
            currentMenu={currentMenu}
            visible={showMenu}
          />
        </Otherwise>
      </Choose>
      <Head>
        <title>{title || setting.site_name}</title>
      </Head>
    </div>
  )
}

export default Header;
