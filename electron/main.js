// 加载环境变量
require('dotenv').config();

const { app, ipcMain } = require('electron');
const setupIpcHandlers = require('./ipc/note');
const { createMainWindow } = require('./config/window');
const noteService = require('./services/note');
const prisma = require('./utils/prisma-client');
const { log } = require('./utils/log');

let mainWindow;

// 当 Electron 完成初始化时创建窗口
app.whenReady().then(async () => {
  log(`应用启动 - 版本: ${process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}`);
  log(`开发模式: ${process.env.NEXT_PUBLIC_DEV === 'true' ? '是' : '否'}`);
  
  try {
    // 创建主窗口
    mainWindow = await createMainWindow();
    
    if (!mainWindow) {
      log('错误: 创建主窗口失败，返回值为 null');
      return;
    }
    
    // 设置 IPC 处理程序
    setupIpcHandlers(ipcMain);
    
    log('应用程序启动完成');
  } catch (error) {
    log(`启动过程中发生错误: ${error.message}`);
    log(error.stack || '无堆栈信息');
    app.quit();
  }
});

// 当所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  log('所有窗口已关闭');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 确保应用退出前断开 Prisma 连接
app.on('before-quit', async () => {
  log('应用程序准备退出，断开数据库连接');
  try {
    await prisma.disconnect();
  } catch (error) {
    log(`断开数据库连接时出错: ${error.message}`);
  }
});

// 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
// 通常在应用程序中重新创建一个窗口。
app.on('activate', async () => {
  log('收到 activate 事件');
  if (!mainWindow) {
    try {
      mainWindow = await createMainWindow();
    } catch (error) {
      log(`重新创建窗口时出错: ${error.message}`);
    }
  }
}); 