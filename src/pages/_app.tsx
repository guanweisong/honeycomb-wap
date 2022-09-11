import React, { useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { AppProps } from 'next/app';
import BackToTop from '@/src/components/BackToTop';
import '@/src/assets/markdown.less';
import { initGA, logPageView } from '@/src/utils/analytics';
import './app.less';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    initGA('UA-158268354-2');
    // `routeChangeComplete` won't run for the first page load unless the query string is
    // hydrated later on, so here we log a page view if this is the first render and
    // there's no query string
    if (!router.asPath.includes('?')) {
      logPageView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <BackToTop />
    </>
  );
};

export default MyApp;
