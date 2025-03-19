const { log } = require('../utils/log');
const prisma = require('../utils/prisma-client');

/**
 * 笔记服务，提供笔记相关的数据库操作
 */
const noteService = {
  /**
   * 创建笔记
   * @param {Object} noteData 笔记数据
   * @returns {Promise<Object>} 操作结果
   */
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

  /**
   * 获取所有笔记
   * @returns {Promise<Object>} 操作结果
   */
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

  /**
   * 删除笔记
   * @param {number} id 笔记ID
   * @returns {Promise<Object>} 操作结果
   */
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
  }
};

module.exports = noteService; 