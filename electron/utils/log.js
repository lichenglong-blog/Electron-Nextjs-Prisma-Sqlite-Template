const path = require('path');
const fs = require('fs');
const { app } = require('electron');

// 使用环境变量判断是否为开发环境
const isDev = process.env.NEXT_PUBLIC_DEV === 'true';

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
            const now = new Date();
            const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            fs.appendFileSync(
                path.join(logDir, "app.log"),
                `${formattedDate} - ${message}\n`
            );
        } catch (err) {
            console.error("写入日志失败:", err);
        }
    }
};

module.exports = {
    log,
};
