const noteService = require('../services/note');

// 设置 IPC 处理程序
function setupIpcHandlers(ipcMain) {
  // 创建笔记
  ipcMain.handle('createNote', async (event, noteData) => {
    return await noteService.createNote(noteData);
  });

  // 获取所有笔记
  ipcMain.handle('getNotes', async () => {
    return await noteService.getNotes();
  });
  
  // 删除笔记
  ipcMain.handle('deleteNote', async (event, id) => {
    return await noteService.deleteNote(id);
  });
}

module.exports = setupIpcHandlers; 