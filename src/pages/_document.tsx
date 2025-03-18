import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="AI驱动的笔记应用" />
      </Head>
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `
            // 调用 preload 脚本提供的修复函数
            if (window.__fixWebpack) {
              window.__fixWebpack();
            } else {
              // 备用方案：如果 preload 脚本未加载
              if (typeof global === 'undefined') {
                window.global = window;
              }
              if (typeof process === 'undefined') {
                window.process = { env: {} };
              }
            }
          `
        }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 