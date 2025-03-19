const { app, BrowserWindow } = require("electron");
const { startNextServer, cleanupNextServer, getCurrentPort } = require("../utils/server");
const { log } = require("../utils/log");
const { killPortSync } = require("../utils/port");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";

// 标记应用是否正在退出
let isQuitting = false;

// 添加退出前的处理
app.on('before-quit', (event) => {
    // 如果已经处理过，跳过
    if (isQuitting) return;
    
    log("应用退出前，清理端口 3000");
    
    // 阻止应用退出，等待端口清理完成
    event.preventDefault();
    isQuitting = true;
    
    try {
        // 使用同步方式确保端口完全释放
        const result = killPortSync(3000);
        log(`端口清理${result ? '成功' : '失败'}，继续退出`);
    } catch (err) {
        log(`端口清理失败: ${err.message}`);
    }
    
    // 继续退出应用
    app.quit();
});


// 创建主窗口
async function createMainWindow() {
    try {
        // 确保Next.js服务已启动
        if (isDev) {
            await startNextServer();
        }

        // 创建浏览器窗口
        const mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                webSecurity: false,
            },
        });

        // 加载页面
        const startUrl = `http://localhost:${getCurrentPort()}`
  
        await mainWindow.loadURL(startUrl);

        // 开发环境下打开开发者工具
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }

        // 监听窗口关闭事件
        mainWindow.on("closed", () => {
            // 窗口关闭时终止Next.js服务
            log("窗口关闭，清理服务器资源");
            cleanupNextServer();
            // 取消引用窗口对象
        });

        return mainWindow;
    } catch (error) {
        log(`创建主窗口失败: ${error.message}`);
        throw error;
    }
}

// 监听所有窗口关闭事件
app.on("window-all-closed", () => {
    log("所有窗口关闭");
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，否则绝大部分应用及其菜单栏会保持激活
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// 监听应用激活事件
app.on("activate", async () => {
    // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，绝大部分应用会重新创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) {
        await createMainWindow();
    }
});

module.exports = {
    createMainWindow,
};
