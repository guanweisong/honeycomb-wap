import React from 'react';
import GA from '@/src/components/GA';
import '@/src/assets/markdown.scss';
import 'antd-mobile/es/global';
import './app.scss';

export const revalidate = 3600;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width" />
        <link rel="shortcut icon" href="/static/images/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="/static/stylesheets/nprogress.css" />
        <script src="https://ssl.captcha.qq.com/TCaptcha.js" />
      </head>
      <body>{children}</body>
      <GA />
    </html>
  );
}
