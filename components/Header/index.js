import React, { Component } from 'react';
import {inject, observer} from "mobx-react";
import classNames from 'classnames';
import { NavBar, Icon } from 'antd-mobile';
import { withRouter } from 'next/router';
import Menu from '../../components/Menu';
import  './index.less';

@withRouter
@inject('store')
@observer
class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      showMenu: false,
      currentPath: "",
    }
  };
  componentWillReceiveProps(props) {
    if (this.state.currentPath !== props.router.currentPath) {
      this.setState({
        showMenu: false,
        currentPath: props.router.asPath,
      })
    }
  };
  componentDidMount() {
    this.setState({
      currentPath: this.props.router.asPath,
    })
  }
  toggleMenu = () => {
    this.setState({
      showMenu: !this.state.showMenu,
    });
  };
  render () {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => console.log('onLeftClick')}
          rightContent={[
            <Icon key="1" type="ellipsis" onClick={() => this.toggleMenu()}/>,
          ]}
        >
          {this.props.store.settingStore.setting.site_name}
        </NavBar>
        <Menu menu={this.props.store.menuStore.list} show={this.state.showMenu}/>
      </div>
    )
  }
}

export default Header;
