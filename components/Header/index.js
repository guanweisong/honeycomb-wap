import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { NavBar, Icon } from 'antd-mobile';
import  './index.less';

class Header extends PureComponent {
  constructor(props){
    super(props)
  };
  render () {
    return (
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => console.log('onLeftClick')}
        rightContent={[
          <Icon key="1" type="ellipsis" />,
        ]}
      >新一站保险</NavBar>
    )
  }
}

export default Header;
