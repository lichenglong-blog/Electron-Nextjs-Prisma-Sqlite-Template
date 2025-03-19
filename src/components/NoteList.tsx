'use client';

import { useSpring, animated, useSprings, SpringValue } from '@react-spring/web';
import { Note } from '@/types/note';
import { useState, useEffect } from 'react';

interface NoteListProps {
  notes: Note[];
  onDeleteNote?: (id: number) => Promise<boolean>;
}

const NoteList = ({ notes, onDeleteNote }: NoteListProps) => {
  // 格式化日期
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 为每个笔记创建一个动画实例，实现依次显示效果
  const [springs, api] = useSprings(notes.length, (index: number) => ({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: index * 100, // 每个项目延迟100毫秒
    config: { tension: 280, friction: 20 }
  }));

  // 当列表项数量变化时重新应用动画
  useEffect(() => {
    api.start((index: number) => ({
      opacity: 1,
      transform: 'translateY(0)',
      delay: index * 100,
      from: {
        opacity: 0,
        transform: 'translateY(20px)'
      }
    }));
  }, [notes.length, api]);

  // 处理删除笔记
  const handleDeleteNote = async (id: number) => {
    if (onDeleteNote) {
      await onDeleteNote(id);
    }
  };

  return (
    <div className="space-y-3">
      {springs.map((style: any, index: number) => (
        <NoteItem 
          key={notes[index].id ?? index} 
          note={notes[index]} 
          formatDate={formatDate}
          style={style}
          onDelete={handleDeleteNote}
        />
      ))}
    </div>
  );
};

// 笔记项组件
interface NoteItemProps {
  note: Note;
  formatDate: (date: Date) => string;
  style: {
    opacity: any;
    transform: any;
    [key: string]: any;
  };
  onDelete?: (id: number) => Promise<void>;
}

const NoteItem = ({ note, formatDate, style, onDelete }: NoteItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // hover 动画效果
  const hoverProps = useSpring({
    boxShadow: isHovered 
      ? '0 6px 15px rgba(0, 0, 0, 0.1)' 
      : '0 1px 3px rgba(0, 0, 0, 0.1)',
    transform: isHovered 
      ? 'translateY(-4px)' 
      : 'translateY(0)',
    config: { tension: 300, friction: 10 }
  });

  // 删除按钮动画
  const deleteButtonSpring = useSpring({
    opacity: isHovered ? 1 : 0,
    transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
    config: { tension: 400, friction: 20 }
  });

  // 合并从列表传入的样式和 hover 样式
  const combinedStyle = {
    ...style,
    boxShadow: hoverProps.boxShadow,
    // 注意: style.transform 会被 hover 时的 transform 覆盖，这是预期行为
  };

  // 处理删除
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止冒泡，避免触发其他点击事件
    
    if (onDelete && !isDeleting && note.id !== undefined) {
      setIsDeleting(true);
      try {
        await onDelete(note.id);
      } catch (error) {
        console.error('删除笔记失败:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <animated.div
      style={combinedStyle}
      className="relative p-4 border border-gray-200 rounded-lg bg-gray-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      aria-label={`笔记：${note.title}`}
    >
      <h3 className="mb-1 text-lg font-medium text-gray-800">{note.title}</h3>
      <p className="mb-2 text-gray-600">{note.content}</p>
      <time className="block text-xs text-right text-gray-400">
        {note.createdAt ? formatDate(note.createdAt) : '未知时间'}
      </time>
      
      {/* 删除按钮 */}
      <animated.button
        style={deleteButtonSpring}
        className="absolute flex items-center justify-center w-8 h-8 text-white transition-colors bg-red-500 rounded-full top-2 right-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label="删除笔记"
      >
        {isDeleting ? (
          <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
        )}
      </animated.button>
    </animated.div>
  );
};

export default NoteList; 