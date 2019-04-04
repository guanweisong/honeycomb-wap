import App, { Container } from 'next/app';
import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import '../node_modules/antd-mobile/dist/antd-mobile.less';
import './app.less';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
      if (pageProps.store) {
        await pageProps.store.dispatch({ type: 'menu/getMenuData' });
        await pageProps.store.dispatch({
          type: 'setting/getSettingData',
          payload: {}
        });
        pageProps = {...pageProps, initialState: pageProps.store.getState()}
      }
    }
    return { pageProps };
  }

  render () {
    const {Component, pageProps} = this.props;
    return <Container>
      <Component {...pageProps} />
    </Container>
  }
}

export default MyApp;
