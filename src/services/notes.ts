import request, { ResponseType } from '@/utils/request';
import { Note } from '@/types/note';

/**
 * 笔记服务类，封装笔记相关的API调用
 */
export default class NoteService {
  /**
   * 获取所有笔记
   */
  static async getNotes(): Promise<ResponseType<Note[]>> {
    return await request.get('/notes');
  }

  /**
   * 获取单个笔记
   * @param id 笔记ID
   */
  static async getNote(id: number): Promise<ResponseType<Note>> {
    return await request.get(`/notes/${id}`);
  }

  /**
   * 创建笔记
   * @param data 笔记数据
   */
  static async createNote(data: { title: string; content: string }): Promise<ResponseType<Note>> {
    return await request.post('/notes', data);
  }

  /**
   * 更新笔记
   * @param id 笔记ID
   * @param data 更新数据
   */
  static async updateNote(id: number, data: { title?: string; content?: string }): Promise<ResponseType<Note>> {
    return await request.put(`/notes/${id}`, data);
  }

  /**
   * 删除笔记
   * @param id 笔记ID
   */
  static async deleteNote(id: number): Promise<ResponseType> {
    return await request.delete(`/notes/${id}`);
  }
} 