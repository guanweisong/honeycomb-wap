import React from 'react';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Viewport } from 'next';
import '@/src/assets/markdown.scss';
import '../app.scss';
import BackToTop from '@/src/components/BackToTop';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ThemeProvider from '@/src/components/ThemeProvider';
import { unstable_setRequestLocale } from 'next-intl/server';
import { MultiLang } from '@/src/types/Language';

export const revalidate = 60;

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: keyof MultiLang };
}) {
  unstable_setRequestLocale(locale);

  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <Script src="https://ssl.captcha.qq.com/TCaptcha.js" strategy="lazyOnload" />
      </head>
      <body>
        <ThemeProvider attribute="class">
          <div className="min-h-full pt-14 lg:pt-24 text-base">
            <Header />
            <div className={'container px-2'}>{children}</div>
            <Footer />
            <BackToTop />
          </div>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-F7GLX9X5VT" />
    </html>
  );
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
