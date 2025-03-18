import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

// 确保全局变量在浏览器环境中存在
if (typeof window !== 'undefined') {
  (window as any).global = window;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AI笔记应用</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
} 