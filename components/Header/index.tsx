import React from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { withRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { SettingStateType } from '@/models/setting';
import { GlobalStoreType } from '@/types/globalStore';
import Head from 'next/head';
import  './index.less';

const Header = (props: any) => {

  const { setting } = useSelector<GlobalStoreType, SettingStateType>(state => state.setting);
  const dispatch = useDispatch();

  /**
   * 返回按钮事件
   */
  const handleClickLeft = () => {
    props.router.back();
  };

  /**
   * 菜单展开事件
   */
  const toggleMenu = () => {
    dispatch({
      type: 'menu/setMenuShow',
      payload: true,
    })
  };

  return (
    <>
      <NavBar
        mode="light"
        icon={<Icon type="left" color="#666"/>}
        onLeftClick={handleClickLeft}
        rightContent={[
          <Icon key="1" color="#666" type="ellipsis" onClick={toggleMenu}/>,
        ]}
      >
        {props.title || setting.site_name}
      </NavBar>
      <Head>
        <title>{props.title || setting.site_name}</title>
      </Head>
    </>
  )
}

export default withRouter(Header);
