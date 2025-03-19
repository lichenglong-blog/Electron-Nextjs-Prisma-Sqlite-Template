import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// 判断是否为开发环境
const isDev = process.env.NODE_ENV === 'development';

// 防止开发环境中创建多个实例
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 确保数据库目录存在
function ensureDbExists() {
  try {
    // 数据库目录和文件路径
    const dbDir = path.join(process.cwd(), 'prisma');
    const dbPath = path.join(dbDir, 'notes.db');
    
    // 确保目录存在
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log(`数据库目录已创建: ${dbDir}`);
    }
    
    console.log(`数据库路径: ${dbPath}`);
    return `file:${dbPath}`;
  } catch (error) {
    console.error(`确保数据库存在时出错:`, error);
    throw error;
  }
}

// 创建Prisma客户端单例
export function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: ensureDbExists()
      }
    },
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
  });
  
  if (isDev) globalForPrisma.prisma = prisma;
  
  return prisma;
}

// 导出单例
const prisma = getPrismaClient();
export default prisma; 