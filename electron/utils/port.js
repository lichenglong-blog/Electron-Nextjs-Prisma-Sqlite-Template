const { exec, execSync } = require('child_process');
const { log } = require('./log');

// 根据端口杀死进程 (Promise版本)
function killPort(port) {
    log(`尝试杀死端口 ${port} 上的进程`);
    
    // Windows平台用于查找和杀死端口对应进程的命令
    const findCmd = `netstat -ano | findstr ":${port}"`;
    
    return new Promise((resolve, reject) => {
        try {
            // 执行查找命令并直接杀死进程
            exec(findCmd, (error, stdout) => {
                if (error) {
                    log(`查找进程失败: ${error.message}`);
                    reject(error);
                    return;
                }
                
                if (stdout) {
                    // 提取PID
                    log(stdout);
                    const pidMatches = stdout.match(/LISTENING\s+(\d+)/);
                    if (pidMatches && pidMatches[1]) {
                        const pid = pidMatches[1];
                        log(`找到端口 ${port} 对应的进程 PID: ${pid}，准备终止`);
                        
                        // 直接杀死进程
                        exec(`taskkill /F /PID ${pid}`, (error) => {
                            if (error) {
                                log(`终止进程失败: ${error.message}`);
                                reject(error);
                            } else {
                                log(`成功终止端口 ${port} 上的进程`);
                                resolve();
                            }
                        });
                    } else {
                        log(`未找到端口 ${port} 的监听进程`);
                        resolve();
                    }
                } else {
                    log(`未找到端口 ${port} 的监听进程`);
                    resolve();
                }
            });
        } catch (error) {
            log(`杀死端口进程失败: ${error.message}`);
            reject(error);
        }
    });
}

// 根据端口杀死进程 (同步版本)
function killPortSync(port) {
    log(`尝试同步杀死端口 ${port} 上的进程`);
    
    try {
        // 查找占用端口的进程
        const findCmd = `netstat -ano | findstr ":${port}"`;
        let stdout;
        
        try {
            stdout = execSync(findCmd, { encoding: 'utf8' });
        } catch (error) {
            log(`查找进程失败: ${error.message}`);
            return false;
        }
        
        if (!stdout) {
            log(`未找到端口 ${port} 的监听进程`);
            return true;
        }
        
        log(stdout);
        
        // 提取PID
        const pidMatches = stdout.match(/LISTENING\s+(\d+)/);
        if (pidMatches && pidMatches[1]) {
            const pid = pidMatches[1];
            log(`找到端口 ${port} 对应的进程 PID: ${pid}，准备终止`);
            
            // 直接杀死进程
            try {
                execSync(`taskkill /F /PID ${pid}`, { encoding: 'utf8' });
                log(`成功终止端口 ${port} 上的进程`);
                return true;
            } catch (error) {
                log(`终止进程失败: ${error.message}`);
                return false;
            }
        } else {
            log(`未找到端口 ${port} 的监听进程`);
            return true;
        }
    } catch (error) {
        log(`杀死端口进程失败: ${error.message}`);
        return false;
    }
}

module.exports = {
    killPort,
    killPortSync
}; 