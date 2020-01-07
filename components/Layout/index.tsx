import React, { useEffect, ReactNode } from 'react';
import classNames from 'classnames';
import { withRouter } from 'next/router';
import { NextRouter } from 'next/dist/client/router';
import { useSelector, useDispatch } from 'react-redux';
import { MenuStateType } from '@/models/menu';
import { GlobalStoreType } from '@/types/globalStore';
import Menu from '../Menu';
import styles from './index.less';

interface ILayout {
  children: ReactNode;
  router: NextRouter;
}

const Layout = (props: ILayout) => {

  const menu = useSelector<GlobalStoreType, MenuStateType>(state => state.menu);
  const dispatch = useDispatch();
  
  /**
   * 路由变化
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    toggleMenu();
  }, [props.router.asPath])

  /**
   * 菜单展开收起
   */
  const toggleMenu = () => {
    dispatch({
      type: 'menu/setMenuShow',
      payload: false,
    })
  };

  return (
    <div className={classNames({
      [styles.container]: true,
      [styles["show-menu"]]: menu.showMenu
    })}>
      <div className={styles.side}>
        <Menu menu = {menu}/>
      </div>

      <div className={styles.main}>
        {props.children}
      </div>
      <div className={styles.mask} onClick={toggleMenu}/>
    </div>
  )

}

export default withRouter(Layout);
