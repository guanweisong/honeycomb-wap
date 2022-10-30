import React from 'react';
import Layout from '@/src/components/Layout';
import '@/src/assets/markdown.scss';
import 'antd-mobile/es/global';
import './app.scss';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
        <meta name="viewport" content="width=device-width" />
        <link rel="shortcut icon" href="/static/images/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="/static/stylesheets/nprogress.css" />
        <script src="https://ssl.captcha.qq.com/TCaptcha.js" />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
