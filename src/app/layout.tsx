import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI笔记应用',
  description: 'AI驱动的笔记应用',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
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
        {children}
      </body>
    </html>
  );
} 