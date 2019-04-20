import App, { Container } from 'next/app';
import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import { Provider } from 'react-redux';
import withDva from '../utils/withDva';
import '../node_modules/antd-mobile/dist/antd-mobile.less';
import './app.less';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

@withDva
class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
      if (ctx.dvaStore.getState().menu.list.length === 0) {
        await ctx.dvaStore.dispatch({ type: 'menu/getMenuData' });
      }
      if (ctx.dvaStore.getState().setting.site_name === '') {
        await ctx.dvaStore.dispatch({ type: 'setting/getSettingData', payload: {} });
      }
      pageProps = { initialState: ctx.dvaStore.getState()}
    }
    return { pageProps };
  }

  render () {
    const {Component, pageProps, dvaStore} = this.props;
    return (
      <Container>
        <Provider store={dvaStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

export default MyApp;
