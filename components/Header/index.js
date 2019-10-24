import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Head from 'next/head';
import  './index.less';

@withRouter
@connect(state => state)
class Header extends Component {
  constructor(props){
    super(props);
  };
  handleClickLeft = () => {
    this.props.router.back();
  };
  toggleMenu = () => {
    this.props.dispatch({
      type: 'menu/setMenuShow',
      payload: !this.props.menu.show,
    })
  };
  render () {
    return (
      <>
        <NavBar
          mode="light"
          icon={<Icon type="left" color="#666"/>}
          onLeftClick={this.handleClickLeft}
          rightContent={[
            <Icon key="1" color="#666" type="ellipsis" onClick={() => this.toggleMenu()}/>,
          ]}
        >
          {this.props.title || this.props.setting.site_name}
        </NavBar>
        <Head>
          <title>{this.props.title || this.props.setting.site_name}</title>
        </Head>
      </>
    )
  }
}

export default Header;
