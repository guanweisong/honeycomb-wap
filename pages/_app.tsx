import App, { Container } from 'next/app';
import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import { Provider } from 'react-redux';
import withDva from '@/utils/withDva';
import Layout from '@/components/Layout';
import '@/node_modules/antd-mobile/dist/antd-mobile.less';
import './app.less';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// @ts-ignore
@withDva
class MyApp extends App {
  // @ts-ignore
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
      if (ctx.dvaStore.getState().menu.menu.length === 0) {
        await ctx.dvaStore.dispatch({ type: 'menu/indexMenu' });
      }
      if (ctx.dvaStore.getState().setting.setting.site_name === '') {
        await ctx.dvaStore.dispatch({ type: 'setting/indexSetting', payload: {} });
      }
      pageProps = { initialState: ctx.dvaStore.getState()}
    }
    return { pageProps };
  }

  render () {
    // @ts-ignore
    const {Component, pageProps, dvaStore} = this.props;
    return (
      <Container>
        <Provider store={dvaStore}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </Container>
    )
  }
}

export default MyApp;
