import React from 'react'
import Router from 'next/router'
import NProgress from 'nprogress'
import { AppProps } from 'next/app'
// @ts-ignore
import withGA from 'next-ga'
import '@/node_modules/antd-mobile/dist/antd-mobile.less'
import './app.less'

NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
});
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

// MyApp.getInitialProps = async () => {
//   const props = {
//     menu: [],
//   }
//
//   const queryMenuResult = await MenuServer.indexMenu()
//   if (queryMenuResult.status === 200 ) {
//     props.menu = queryMenuResult.data.list
//   }
//   return {
//     appProps: props
//   }
// }

export default withGA("UA-158268354-2", Router)(MyApp);
