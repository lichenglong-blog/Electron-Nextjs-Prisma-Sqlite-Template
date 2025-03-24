// 加载环境变量
require("dotenv").config();
const { startNextServer } = require("./utils/server");
const { app } = require("electron");
const { createMainWindow } = require("./config/window");
const { log } = require("./utils/log");
const { killPortSync } = require("./utils/port");
let mainWindow;
let isDev = process.env.NODE_ENV === "true";
// 应用初始化时清理端口
try {
  log("应用启动，清理端口 3000");
  if (!isDev) {
  killPortSync(3000);

    log("启动next server");
    startNextServer();
}
} catch (err) {
  log(`启动时清理端口失败: ${err.message}`);
}

// 当 Electron 完成初始化时创建窗口
app.whenReady().then(async () => {
    log(`应用启动 - 版本: ${process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}`);
    log(`开发模式: ${process.env.NEXT_PUBLIC_DEV === "true" ? "是" : "否"}`);
    

    try {
        // 创建主窗口
        mainWindow = await createMainWindow();

        if (!mainWindow) {
            log("错误: 创建主窗口失败，返回值为 null");
            return;
        }

        log("应用程序启动完成");
    } catch (error) {
        log(`启动过程中发生错误: ${error.message}`);
        log(error.stack || "无堆栈信息");
        app.quit();
    }
});

// 当所有窗口关闭时退出应用
app.on("window-all-closed", () => {
    log("所有窗口已关闭");
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
// 通常在应用程序中重新创建一个窗口。
app.on("activate", async () => {
    log("收到 activate 事件");
    if (!mainWindow) {
        try {
            mainWindow = await createMainWindow();
        } catch (error) {
            log(`重新创建窗口时出错: ${error.message}`);
        }
    }
});
