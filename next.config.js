const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 修改输出目录配置
  distDir: 'dist/renderer',
  // 在Electron环境中需要禁用图像优化
  images: {
    unoptimized: true,
  },
  // 确保Next.js能在Electron环境中正常工作
  assetPrefix: './',
  // 配置 webpack 以支持 Electron
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
      
      // 注入 Node.js 全局变量
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.browser': true,
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          '__dirname': JSON.stringify('/'),
          '__filename': JSON.stringify(''),
        })
      );
    }
    return config;
  },
  output: 'export',
  trailingSlash: true,
}

// 禁用遥测
process.env.NEXT_TELEMETRY_DISABLED = '1';

module.exports = nextConfig 