import React, { Component } from 'react';
import classNames from 'classnames';
import { NavBar, Icon } from 'antd-mobile';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Menu from '../Menu';
import  './index.less';

@withRouter
@connect(state => state)
class Layout extends Component {
  constructor(props){
    super(props);
  };
  componentWillReceiveProps(props) {
    if (this.props.router.asPath !== props.router.asPath) {
      window.scrollTo(0, 0);
      this.toggleMenu();
    }
  };
  toggleMenu = () => {
    this.props.dispatch({
      type: 'menu/setMenuShow',
      payload: false,
    })
  };
  render () {
    return (
      <div className={classNames({
        "container": true,
        "show-menu": this.props.menu.show
      })}>
        <div className="side">
          <Menu menu={this.props.menu.list}/>
        </div>

        <div className="main">
          {this.props.children}
        </div>
        <div className="mask" onClick={this.toggleMenu}/>
      </div>
    )
  }
}

export default Layout;
