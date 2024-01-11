import React from 'react';
import Script from 'next/script';
import type { Viewport } from 'next';
import '@/src/assets/markdown.scss';
import 'antd-mobile/es/global';
import BackToTop from '@/src/components/BackToTop';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ThemeProvider from '@/src/components/ThemeProvider';
import { unstable_setRequestLocale } from 'next-intl/server';

export const revalidate = 60;

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-full pt-14 lg:pt-24">
            <Header />
            <div className={'container px-2'}>{children}</div>
            <Footer />
            <BackToTop />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
