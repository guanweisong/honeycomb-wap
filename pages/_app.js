import App, { Container } from 'next/app';
import React from 'react';
import { initializeStore } from '../store';
import { Provider } from 'mobx-react';
import Menu from '../components/Menu';
import '../node_modules/antd-mobile/dist/antd-mobile.less';
import './app.less';
import MenuStore from "../stores/menu";

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

    await appContext.ctx.store.settingStore.getSettingData();

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
    console.log('_appjs=>render', this.store.settingStore);
    return (
      <Container>
        1
        {this.store.settingStore.setting.site_name}
        {/*<Menu menu={this.store.menuStore.list}/>*/}
        {/*{this.store.categoryStore.list.length}*/}
        <Provider store={this.store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}
export default MyMobxApp;
