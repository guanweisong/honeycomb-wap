import React, { useState, useRef, useEffect } from 'react'
import { NavBar, Icon } from 'antd-mobile'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from "./index.less"
import { MenuType } from "@/src/types/menu"
import Menu from "@/src/components/Menu"
import { SettingType } from "@/src/types/setting"
import { useClickAway } from 'ahooks'

export interface HeaderProps {
  title: string | undefined
  menu: MenuType []
  setting: SettingType
  currentMenu?: string
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
    <div ref={ref}>
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
      <Head>
        <title>{title || setting.site_name}</title>
      </Head>
      <Menu
        menu={menu}
        currentMenu={currentMenu}
        visible={showMenu}
      />
    </div>
  )
}

export default Header;
