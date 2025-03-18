const path = require('path');
const isDev = process.env.NEXT_PUBLIC_DEV === 'true';
const { BrowserWindow, app } = require('electron');
const { waitForNextServer } = require('../utils/next');
const { log } = require('../utils/log');
const fs = require('fs');

// 从环境变量获取窗口配置
const WINDOW_WIDTH = parseInt(process.env.NEXT_PUBLIC_WINDOW_WIDTH || '1200', 10);
const WINDOW_HEIGHT = parseInt(process.env.NEXT_PUBLIC_WINDOW_HEIGHT || '800', 10);
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || '笔记应用';




// 查找 HTML 文件
function findHtmlFile() {
 
  return  path.join(app.getAppPath(), 'dist', 'renderer', 'index.html');
}

// 创建主窗口函数
async function createMainWindow() {
  // 在开发模式下等待 Next.js 服务器启动
  if (isDev) {
    try {
      await waitForNextServer();
    } catch (error) {
      console.error('等待 Next.js 服务器启动失败:', error);
      return null;
    }
  }

  // 获取 preload 路径
  const preloadPath = path.join(__dirname, '../preload.js');
  log(`使用 preload 路径: ${preloadPath}`);

  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: preloadPath
    }
  });

  // 设置窗口标题
  mainWindow.setTitle(APP_NAME);

  // 根据环境确定要加载的 URL
  let startUrl;
  if (isDev) {
    startUrl = 'http://localhost:3000';
    log(`开发模式: 加载 ${startUrl}`);
    mainWindow.loadURL(startUrl);
  } else {
    // 生产环境下使用文件协议加载 HTML 文件
    const htmlPath = findHtmlFile();
    startUrl = `file://${htmlPath}`;
    log(`生产模式: 加载 ${startUrl}`);
    mainWindow.loadURL(startUrl);
  }

  // 在开发模式下打开 DevTools
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // 监听窗口关闭事件
  mainWindow.on('closed', () => {
    // 取消引用窗口对象
  });

  return mainWindow;
}

// 导出函数
module.exports = {
  createMainWindow
}; 