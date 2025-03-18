import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import NoteList from '@/components/NoteList';
import NoteForm from '@/components/NoteForm';
import { Note } from '@/types/note';

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
      // 检查 electronAPI 是否可用（在 Electron 环境中才存在）
      if (typeof window !== 'undefined' && window.electronAPI) {
        const response = await window.electronAPI.getNotes();
        if (response.success) {
          setNotes(response.notes || []);
        } else {
          setError(response.error || '加载笔记失败');
        }
      } else {
        // 在浏览器环境中（开发时可能直接使用 Next.js 服务器预览）
        console.log('electronAPI 不可用，可能在纯浏览器环境中运行');
        // 使用模拟数据用于开发
        setNotes([
          { id: 1, title: '示例笔记1', content: '这是一个示例内容', createdAt: new Date() },
          { id: 2, title: '示例笔记2', content: '这是另一个示例内容', createdAt: new Date() }
        ]);
      }
    } catch (err) {
      setError('加载笔记时出错');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 创建笔记
  const handleCreateNote = async (noteData: Omit<Note, 'id' | 'createdAt'>) => {
    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        const response = await window.electronAPI.createNote(noteData);
        if (response.success) {
          // 重新加载笔记列表
          loadNotes();
          return true;
        } else {
          setError(response.error || '创建笔记失败');
          return false;
        }
      } else {
        console.log('electronAPI 不可用，模拟创建笔记成功');
        // 在开发环境中模拟成功
        setNotes([
          { id: Date.now(), title: noteData.title, content: noteData.content, createdAt: new Date() },
          ...notes
        ]);
        return true;
      }
    } catch (err) {
      setError('创建笔记时出错');
      console.error(err);
      return false;
    }
  };

  // 删除笔记
  const handleDeleteNote = async (id: number) => {
    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        const response = await window.electronAPI.deleteNote(id);
        if (response.success) {
          // 刷新笔记列表
          loadNotes();
          return true;
        } else {
          setError(response.error || '删除笔记失败');
          return false;
        }
      } else {
        console.log('electronAPI.deleteNote 不可用，模拟删除笔记');
        // 在开发环境中模拟删除成功
        setNotes(notes.filter(note => note.id !== id));
        return true;
      }
    } catch (err) {
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