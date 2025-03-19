const { exec } = require('child_process');
const { log } = require('./log');
const path = require('path');
const fs = require('fs');
const { killPort } = require('./port');

// 存储Next.js服务进程引用
let nextServerProcess = null;
// 固定使用3000端口
const PORT = 3000;

// 启动Next.js服务
async function startNextServer() {
    const serverPath = path.join(process.resourcesPath, "renderer/server.js");

    log(`准备启动Next.js服务器，路径: ${serverPath}`);

    if (!fs.existsSync(serverPath)) {
        log(`服务器文件不存在: ${serverPath}`);
        return;
    }

    try {
    
        
        
        
        log(`准备在端口 ${PORT} 上启动Next.js服务器`);
        
        // 创建环境变量
        const envCopy = { ...process.env };
        envCopy.PORT = String(PORT);
        
        // 启动服务器
        const command = `node ${serverPath} --port=${PORT}`;
        log(`执行命令: ${command}`);
        
        nextServerProcess = exec(command, { env: envCopy });
        
        // 添加基本的错误处理
        nextServerProcess.on('error', (err) => {
            log(`Next.js服务器错误: ${err.message}`);
        });
        
        nextServerProcess.stderr.on('data', (data) => {
            log(`Next.js服务器错误输出: ${data}`);
        });
        
        nextServerProcess.stdout.on('data', (data) => {
            log(`Next.js服务器输出: ${data}`);
        });
        
        // 简单等待服务器启动
        await new Promise(resolve => setTimeout(resolve, 2000));
        log(`Next.js服务器已启动，端口: ${PORT}`);
        
        return;
    } catch (error) {
        log(`启动Next.js服务器失败: ${error.message}`);
        throw error;
    }
}

// 清理服务器进程
function cleanupNextServer() {
    if (nextServerProcess) {
        log("正在关闭Next.js服务器");
        nextServerProcess.kill();
        nextServerProcess = null;
        
    
    }
}

// 获取当前端口
function getCurrentPort() {
    return PORT;
}

module.exports = {
    startNextServer,
    cleanupNextServer,
    getCurrentPort
}; 