import App, { Container } from 'next/app';
import React from 'react';
import { initializeStore } from '../store';
import { Provider } from 'mobx-react';
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

// @withMobxStore
class MyMobxApp extends App {
  static async getInitialProps(appContext) {
    console.log('_app__getInitialProps');
    // Get or Create the store with `undefined` as initialState
    // This allows you to set a custom default initialState
    const store = initializeStore();
    // Provide the store to getInitialProps of pages
    appContext.ctx.store = store;

    let appProps = await App.getInitialProps(appContext);
    if (!appContext.ctx.store.settingStore.setting.site_name) {
      await appContext.ctx.store.settingStore.getSettingData();
    }
    if (appContext.ctx.store.menuStore.list.length === 0) {
      await appContext.ctx.store.menuStore.getMenuData();
    }

    return {
      ...appProps,
      initialMobxState: store,
    }
  }

  constructor(props) {
    super(props);
    const isServer = typeof window === 'undefined';
    this.store = isServer ? props.initialMobxState : initializeStore(props.initialMobxState);
  }

  render() {
    const { Component, pageProps } = this.props;
    console.log('_appjs=>render');
    return (
      <Container>
        <Provider store={this.store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}
export default MyMobxApp;
