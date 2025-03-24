const webpack = require('webpack');
const isDev = process.env.NEXT_PUBLIC_DEV === 'true';
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // 修改输出目录配置
  // distDir: 'dist/renderer',
  // 在Electron环境中需要禁用图像优化
  images: {
    unoptimized: true,
  },
  // 最小资源方式
  output: 'standalone',
  // assetPrefix: isDev ? undefined : './',
  // 配置 webpack 以支持 Electron
  webpack:isDev?undefined: (config, { isServer }) => {
    if (!isServer) {
      // 提供Node.js核心模块的浏览器polyfill
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        http: false,
        https: false,
        crypto: false,
        stream: false,
        process: require.resolve('process/browser'),
      };
      
      // 注入全局变量
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
        new webpack.DefinePlugin({
          'process.browser': true,
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        })
      );
    }
    return config;
  },
  
  // 启用Turbopack
  experimental: {
    turbo:isDev? {
      // Turbopack配置选项可以在这里添加
      loaders: {},  // 如果需要可以配置自定义加载器
      rules: {}     // 将数组改为对象
    }:undefined
  }
}

// 禁用遥测
process.env.NEXT_TELEMETRY_DISABLED = '1';

module.exports = nextConfig 