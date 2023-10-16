import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import '@/src/assets/markdown.scss';
import 'antd-mobile/es/global';
import './app.scss';
import BackToTop from '@/src/components/BackToTop';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export const revalidate = 60;

const APP_NAME = '稻草人博客';
const APP_DEFAULT_TITLE = '稻草热人博客';
const APP_TITLE_TEMPLATE = '%s';
const APP_DESCRIPTION = '稻草人的自留地';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111827" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <Script src="https://ssl.captcha.qq.com/TCaptcha.js" strategy="lazyOnload" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-F7GLX9X5VT" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F7GLX9X5VT');
          `}
        </Script>
      </head>
      <body>
        <div className="min-h-full pt-14 lg:pt-24">
          <Header />
          <div className={'container px-2'}>{children}</div>
          <Footer />
          <BackToTop />
        </div>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};
