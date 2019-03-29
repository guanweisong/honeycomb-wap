import React, { PureComponent } from 'react';
import Router from 'next/router';

class Index extends PureComponent {
  componentWillMount() {
    Router.replace('/category', '/');
  }
  render() {
    return null
  }
}

export default Index;