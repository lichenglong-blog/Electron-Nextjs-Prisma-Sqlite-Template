const path = require('path');
const fs = require('fs');
const { app } = require('electron');

// 使用环境变量判断是否为开发环境
const isDev = process.env.NEXT_PUBLIC_DEV === 'true';

// 获取当前日期的格式化字符串（YYYY-MM-DD）
const getDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// 获取当前时间的格式化字符串（YYYY-MM-DD HH:MM:SS）
const getTimeString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
};

// 检查文件大小是否超过限制
const isFileSizeExceeded = (filePath, sizeLimit = 3 * 1024 * 1024) => { // 默认3MB
    try {
        if (!fs.existsSync(filePath)) return false;
        
        const stats = fs.statSync(filePath);
        return stats.size >= sizeLimit;
    } catch (err) {
        console.error(`检查文件大小出错: ${err.message}`);
        return false;
    }
};

// 查找可用的日志文件名
const findAvailableLogFileName = (baseFilePath) => {
    if (!isFileSizeExceeded(baseFilePath)) {
        return baseFilePath;
    }
    
    // 文件名格式: app_2023-05-20_1.log, app_2023-05-20_2.log, ...
    const dir = path.dirname(baseFilePath);
    const ext = path.extname(baseFilePath);
    const baseName = path.basename(baseFilePath, ext);
    
    let counter = 1;
    let newFilePath;
    
    do {
        newFilePath = path.join(dir, `${baseName}_${counter}${ext}`);
        counter++;
    } while (isFileSizeExceeded(newFilePath));
    
    return newFilePath;
};

// 日志函数
const log = message => {
    console.log(`[应用] ${message}`);
    
    // 在生产环境也写入日志文件
    if (!isDev) {
        try {
            const logDir = path.join(app.getPath("userData"), "logs");
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }
            
            // 使用日期作为文件名前缀
            const dateStr = getDateString();
            const baseLogFilePath = path.join(logDir, `app_${dateStr}.log`);
            
            // 查找可用的日志文件
            const logFilePath = findAvailableLogFileName(baseLogFilePath);
            
            // 获取当前时间
            const timeStr = getTimeString();
            
            // 写入日志
            fs.appendFileSync(
                logFilePath,
                `${timeStr} - ${message}\n`
            );
            
            // 如果这个文件刚刚被创建并且不是基本日志文件，添加一行说明
            if (logFilePath !== baseLogFilePath && fs.statSync(logFilePath).size <= (timeStr.length + message.length + 10)) {
                fs.appendFileSync(
                    logFilePath,
                    `${timeStr} - 由于上一个日志文件已达到大小限制，新建日志文件继续记录\n`
                );
            }
        } catch (err) {
            console.error("写入日志失败:", err);
        }
    }
};

module.exports = {
    log,
};
