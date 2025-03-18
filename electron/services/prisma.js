const path = require('path');
const isDev = process.env.NEXT_PUBLIC_DEV === 'true';
const { app } = require('electron');
const fs = require('fs');
const { log } = require('../utils/log');

// 确保文件存在
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    log(`检查文件是否存在出错 (${filePath}): ${error.message}`);
    return false;
  }
};

// 检查 Prisma 客户端模块位置
function findPrismaClientPath() {
  
  // 检查多个可能的路径
  const possiblePaths = [

    // 解压的 asar 包路径
    path.join(process.resourcesPath, 'app.asar.unpacked/node_modules/@prisma/client'),
    path.join(process.resourcesPath, 'app.asar.unpacked/node_modules/.prisma/client'),
  ];
  
  for (const clientPath of possiblePaths) {
    log(`检查 Prisma 客户端路径: ${clientPath}`);
    if (fileExists(clientPath)) {
      log(`找到 Prisma 客户端路径: ${clientPath}`);
      return clientPath;
    }
  }
  
  log('无法找到 Prisma 客户端路径');
  return null;
}

// 确保数据库文件存在
const ensureDbExists = () => {
  try {
    // 在生产环境中，使用 userData 目录存储数据库，这样可以确保有写入权限
    const dbDir = isDev 
      ? path.join(process.cwd(), 'prisma')
      : path.join(app.getPath('userData'), 'prisma');
    
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      log(`创建数据库目录: ${dbDir}`);
    }
    
    const dbPath = path.join(dbDir, 'notes.db');
    
    // 如果数据库不存在，从资源目录复制一个初始数据库
    if (!isDev && !fs.existsSync(dbPath)) {
      const resourceDbPath = path.join(app.getAppPath(), 'prisma', 'notes.db');
      log(`尝试从 ${resourceDbPath} 复制初始数据库到 ${dbPath}`);
      
      if (fs.existsSync(resourceDbPath)) {
        fs.copyFileSync(resourceDbPath, dbPath);
        log('成功复制初始数据库');
      } else {
        log('未找到初始数据库，将创建新的数据库');
      }
    }
    
    log(`数据库路径: ${dbPath}`);
    return `file:${dbPath}`;
  } catch (error) {
    log(`确保数据库存在时出错: ${error.message}`);
    throw error;
  }
};

// 加载 Prisma 客户端
let PrismaClient;

  // 先尝试标准导入
  try {
    log(`尝试标准导入... `);
    
    // 如果标准导入失败，尝试找到客户端路径
    const clientPath = findPrismaClientPath();
    
 
      // 尝试从找到的路径加载
      try {
        const defaultPath = isDev?'@prisma/client':path.join(clientPath, 'index.js');
        if (isDev||fileExists(defaultPath)) {
          log(`尝试从 ${defaultPath} 加载...`);
          const clientModule = require(defaultPath);
          PrismaClient = clientModule.PrismaClient;
          log('从找到的路径加载成功');
        } else {
          // 尝试查找 default.js
          const altPath = path.join(clientPath, 'default.js');
          if (fileExists(altPath)) {
            log(`尝试从 ${altPath} 加载...`);
            const defaultExport = require(altPath);
            PrismaClient = defaultExport.PrismaClient;
            log('从 default.js 加载成功');
          } else {
            throw new Error(`在 ${clientPath} 中未找到有效的 Prisma 客户端文件`);
          }
        }
      } catch (pathImportError) {
        log(`从路径加载失败: ${pathImportError.message}`);
        throw pathImportError;
      }
  
  }
  catch (standardImportError) {
    log(`加载 PrismaClient 失败: ${standardImportError.message}`);
    log(`错误堆栈: ${standardImportError.stack}`);
    throw standardImportError;
  }


// 初始化 Prisma 客户端
let prisma;

try {
  // 打印调试信息
  log(`应用路径: ${isDev ? process.cwd() : app.getAppPath()}`);
  log(`用户数据路径: ${app.getPath('userData')}`);
  log(`资源路径: ${process.resourcesPath}`);
  
  // 初始化 Prisma 客户端
  log('正在初始化 Prisma 客户端...');
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: ensureDbExists()
      }
    }
  });
  
  log('Prisma 客户端初始化成功');
} catch (error) {
  log(`Prisma 客户端初始化失败: ${error.message}`);
  log(`错误堆栈: ${error.stack}`);
  throw error;
}

// 笔记相关的数据库操作
const noteService = {
  // 创建笔记
  createNote: async (noteData) => {
    try {
      const note = await prisma.note.create({
        data: noteData,
      });
      return { success: true, note };
    } catch (error) {
      log(`创建笔记失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  // 获取所有笔记
  getNotes: async () => {
    try {
      const notes = await prisma.note.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return { success: true, notes };
    } catch (error) {
      log(`获取笔记失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  // 删除笔记
  deleteNote: async (id) => {
    try {
      await prisma.note.delete({
        where: {
          id: id,
        },
      });
      log(`成功删除笔记，ID: ${id}`);
      return { success: true };
    } catch (error) {
      log(`删除笔记失败，ID: ${id}, 错误: ${error.message}`);
      return { success: false, error: error.message };
    }
  },

  // 断开数据库连接
  disconnect: async () => {
    try {
      await prisma.$disconnect();
      log('Prisma 连接已断开');
    } catch (error) {
      log(`断开 Prisma 连接失败: ${error.message}`);
    }
  },
};

module.exports = noteService; 