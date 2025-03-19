'use client';

import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import NoteList from '@/components/NoteList';
import NoteForm from '@/components/NoteForm';
import { Note } from '@/types/note';
import NoteService from '@/services/notes';
import { message } from 'antd';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载动画
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 }
  });

  // 加载笔记
  const loadNotes = async () => {
    setLoading(true);
    try {
      const response = await NoteService.getNotes();
      if (response.success) {
        setNotes(response.data || []);
      } else {
        setError(response.error || '加载笔记失败');
      }
    } catch (err: any) {
      setError('加载笔记时出错');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 创建笔记
  const handleCreateNote = async (noteData: Omit<Note, 'id' | 'createdAt'>) => {
    try {
      const response = await NoteService.createNote(noteData);
      if (response.success) {
        message.success('笔记创建成功');
        // 重新加载笔记列表
        loadNotes();
        return true;
      } else {
        setError(response.error || '创建笔记失败');
        return false;
      }
    } catch (err: any) {
      setError('创建笔记时出错');
      console.error(err);
      return false;
    }
  };

  // 删除笔记
  const handleDeleteNote = async (id: number) => {
    try {
      const response = await NoteService.deleteNote(id);
      if (response.success) {
        message.success('笔记删除成功');
        // 刷新笔记列表
        loadNotes();
        return true;
      } else {
        setError(response.error || '删除笔记失败');
        return false;
      }
    } catch (err: any) {
      setError('删除笔记时出错');
      console.error(err);
      return false;
    }
  };

  // 组件挂载时加载笔记
  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <animated.div style={fadeIn} className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center">我的笔记应用</h1>
        
        {error && (
          <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
            <button 
              className="float-right font-bold" 
              onClick={() => setError(null)}
              aria-label="关闭错误提示"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">添加新笔记</h2>
            <NoteForm onSubmit={handleCreateNote} />
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">笔记列表</h2>
            {loading ? (
              <p className="text-gray-500">加载中...</p>
            ) : notes.length > 0 ? (
              <NoteList notes={notes} onDeleteNote={handleDeleteNote} />
            ) : (
              <p className="text-gray-500">暂无笔记</p>
            )}
          </div>
        </div>
      </div>
    </animated.div>
  );
} 