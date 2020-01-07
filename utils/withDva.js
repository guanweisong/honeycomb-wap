import React from 'react';
import dva from 'dva-no-router';
import models from '@/models/index';

const isServer = typeof window === 'undefined';
const __NEXT_DVA_STORE__ = '__NEXT_DVA_STORE__';

// 初始化 Dva
function initDva(initialState) {
  let app;
  if (initialState) {
    app = dva({
      initialState,
    });
  } else {
    app = dva({});
  }
  const isArray = Array.isArray(models);
  if (isArray) {
    models.forEach((m) => {
      app.model(m);
    });
  } else {
    app.model(models);
  }
  app.router(() => {});
  app.start();

  return app._store;
}

// 获取或创建 Store
function getOrCreateStore (initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initDva(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_DVA_STORE__]) {
    window[__NEXT_DVA_STORE__] = initDva(initialState);
  }
  return window[__NEXT_DVA_STORE__];
}

export default App => {
  return class AppWithRedux extends React.Component {
    // getInitialProps 注入点
    static async getInitialProps (appContext) {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const dvaStore = getOrCreateStore();

      // Provide the store to getInitialProps of pages
      appContext.ctx.dvaStore = dvaStore;

      let appProps = {};
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext)
      }

      return {
        ...appProps,
        initialDvaState: dvaStore.getState(),
      }
    }

    constructor (props) {
      super(props);
      this.dvaStore = getOrCreateStore(props.initialDvaState);
    }

    render () {
      return <App {...this.props} dvaStore={this.dvaStore} />
    }
  }
}
