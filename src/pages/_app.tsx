import React  from 'react'
import Router from 'next/router'
import NProgress from 'nprogress'
import { AppProps } from 'next/app'
// @ts-ignore
import withGA from 'next-ga'
import BackToTop from '@/src/components/BackToTop'
import '@/src/assets/markdown.scss'
import './app.scss'

NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
});
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const MyApp = ({ Component, pageProps }: AppProps) => {

  return (
    <>
      <Component {...pageProps}/>
      <BackToTop />
    </>
  )
}

export default withGA("UA-158268354-2", Router)(MyApp);
