import React from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import '@/src/assets/markdown.scss';
import 'antd-mobile/es/global';
import './app.scss';
import BackToTop from '@/src/components/BackToTop';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export const revalidate = 60;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width" />
        <link rel="shortcut icon" href="/static/images/favicon.ico" />
        <Script src="https://ssl.captcha.qq.com/TCaptcha.js" strategy="lazyOnload" />
      </head>
      <body>
        <div className="min-h-full">
          <Header />
          <div className={'container px-2'}>{children}</div>
          <Footer />
          <BackToTop />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
