import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
          <link rel="shortcut icon" href="/static/images/favicon.ico" />
          <link rel='stylesheet' type='text/css' href='/static/stylesheets/nprogress.css' />
          <link rel="stylesheet" type="text/css" href="//at.alicdn.com/t/font_1162161_wn0uyy5zu5k.css" />
          <script src="https://ssl.captcha.qq.com/TCaptcha.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
