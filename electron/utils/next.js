const http = require('http');
const { log } = require('./log');

// 等待 Next.js 服务器启动
async function waitForNextServer() {
  const maxAttempts = 30;
  const interval = 1000; // 1秒
  const url = 'http://localhost:3000';
  
  log(`开始等待 Next.js 服务器启动，检查 URL: ${url}`);

  for (let i = 0; i < maxAttempts; i++) {
    log(`尝试 #${i + 1}/${maxAttempts}...`);
    
    try {
      // 使用内置的 http 模块检查服务器是否可用
      const isAvailable = await new Promise((resolve) => {
        log(`发送 HTTP 请求到 ${url}`);
        
        const req = http.get(url, (res) => {
          const statusOk = res.statusCode >= 200 && res.statusCode < 400;
          log(`收到响应，状态码: ${res.statusCode}, 可用: ${statusOk}`);
          resolve(statusOk);
          res.resume(); // 消费响应数据以释放内存
        });
        
        req.on('error', (err) => {
          log(`请求错误: ${err.message}`);
          resolve(false);
        });
        
        req.setTimeout(1000, () => {
          log('请求超时');
          req.destroy();
          resolve(false);
        });
      });
      
      if (isAvailable) {
        log('Next.js 服务器已启动并可用');
        return true;
      } else {
        log('Next.js 服务器未就绪，将继续尝试...');
      }
    } catch (error) {
      log(`等待过程中发生错误: ${error.message}`);
    }
    
    // 等待下一次尝试
    log(`等待 ${interval}ms 后重试...`);
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  const errorMsg = `在 ${maxAttempts} 次尝试后，Next.js 服务器启动超时`;
  log(errorMsg);
  throw new Error(errorMsg);
}

module.exports = {
  waitForNextServer
}; 