const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 数据库操作
  createNote: (note) => ipcRenderer.invoke('createNote', note),
  getNotes: () => ipcRenderer.invoke('getNotes'),
  deleteNote: (id) => ipcRenderer.invoke('deleteNote', id),
});

// 输出日志以确认 preload 脚本已加载
console.log('Preload 脚本已加载'); 