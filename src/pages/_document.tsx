import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/static/images/favicon.ico" />
          <link rel='stylesheet' type='text/css' href='/static/stylesheets/nprogress.css' />
          <link rel="stylesheet" type="text/css" href="//at.alicdn.com/t/font_1162161_wn0uyy5zu5k.css" />
          <script src="https://ssl.captcha.qq.com/TCaptcha.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
