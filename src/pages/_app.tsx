import React, { useLayoutEffect } from 'react'
import Router from 'next/router'
import NProgress from 'nprogress'
import { AppProps } from 'next/app'
import { configResponsive, useResponsive } from 'ahooks'
// @ts-ignore
import withGA from 'next-ga'
import { PlatformType } from '@/src/types/platform'
import '@/node_modules/antd-mobile/dist/antd-mobile.less'
import '@/src/assets/markdown.less'
import './app.less'

NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
});
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

configResponsive({
  mobile: 1000,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  const responsive = useResponsive();

  useLayoutEffect(() => {
    if (responsive.mobile) {
      document.querySelector('html')?.classList.add('pc')
      document.querySelector('html')?.classList.remove('mobile')
    } else {
      document.querySelector('html')?.classList.remove('pc')
      document.querySelector('html')?.classList.add('mobile')
    }
  }, [responsive?.mobile])

  pageProps.platform = {} as PlatformType
  pageProps.platform.isPC = !!responsive?.mobile

  return <Component {...pageProps}/>
}

export default withGA("UA-158268354-2", Router)(MyApp);
