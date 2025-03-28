# 真正可以运行的--桌面离线全栈应用模板 📝

### 由于市面上没有找到合适的解决方案，因此决定自行开发，支持file协议和 Next.js 约定式路由 API和离线ssr服务端渲染。

🚀🚀🚀贡献首个基于最新 Electron、Next.js、Prisma 和 SQLite 技术构建的桌面应用模板。🚀🚀🚀

🚀🚀🚀体验Nextjs最畅快全栈开发，可开发离线全栈应用，且与本地轻量AI大模型是非常理想的融合应用。🚀🚀🚀

🚀🚀🚀轻量依赖、简洁目录结构，开发、生产环境都能直接运行。🚀🚀🚀


# 版本📝
v1.1.0
   - 解决Electron打包后的asar不能访问的Prisma二进制文件。
   - 确保Nextjs打包输出兼容electron访问。
   - 兼容preload脚本注入文件到渲染线程的加载，而不开放ipc。
   - 目前支持webpack打包，1.1.o不支持nextjs服务端渲染，仅支持file://协议渲染页面
     
v1.1.1
   - log日志3m递增新文件。
   - prisma文件拆分和单例prisam的优化。
     
v1.2.0
   - 支持开发环境turbopack极速打包，nextjs官方暂不支持生产环境打包编译。
   - 支持v1.3.0
     
v1.3.0
   - preloadi api接口的方式和nextjs约定式路由开发api具有很多冲突，可切换到对应1.3.0分支选择拉取
   - 支持electron本地nextjs ssr渲染,不再支持file渲染，让页面负载均衡渲染。
   - 支持v1.2.0


## 技术栈 📝

- Electron 28.x
- Next.js 14.x
- Prisma 5.x
- SQLite3
- TailwindCSS
- React Spring

## 功能 📝

- 显示笔记列表（标题和创建时间）
- 添加新笔记（标题和内容）
- 表单验证
- 数据持久化到 SQLite 数据库
- 基于ipc通信和preload api注入，主线程和渲染线程隔离更安全。
- nextjs ssr渲染、约定式api路由
- log系统

## 开发 📝

### 安装依赖

```bash
pnpm install
```

### 初始化数据库

```bash
pnpm postinstall
```

### 运行开发环境

```bash
pnpm dev
```

这将同时启动 Next.js 开发服务器和 Electron 应用。

## 构建

```bash
pnpm build
```

这将构建 Next.js 应用并打包 Electron 应用程序。


