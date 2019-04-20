import React, { Component } from 'react';
import classNames from 'classnames';
import { NavBar, Icon } from 'antd-mobile';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Menu from '../../components/Menu';
import  './index.less';

@withRouter
@connect(state => state)
class Header extends Component {
  constructor(props){
    super(props);
  };
  componentWillReceiveProps(props) {
    // console.log(8888, this.props.menu.currentCategoryPath, props.router.currentPath);
    // if (this.props.menu.currentCategoryPath !== props.router.currentPath) {
    //   this.props.dispatch({
    //     type: 'menu/setCurrentCategoryPath',
    //     payload: props.router.asPath,
    //   });
    //   this.props.dispatch({
    //     type: 'menu/setMenuShow',
    //     payload: false,
    //   })
    // }
  };
  componentDidMount() {
    // this.props.dispatch({
    //   type: 'menu/setCurrentCategoryPath',
    //   payload: this.props.router.asPath,
    // })
  }
  toggleMenu = () => {
    this.props.dispatch({
      type: 'menu/setMenuShow',
      payload: !this.props.menu.show,
    })
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
          {this.props.setting.site_name}
        </NavBar>
        <Menu menu={this.props.menu.list} show={this.props.menu.show}/>
      </div>
    )
  }
}

export default Header;
