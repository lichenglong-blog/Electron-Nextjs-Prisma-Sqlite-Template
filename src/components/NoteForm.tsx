import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Note } from '@/types/note';

interface NoteFormProps {
  onSubmit: (note: Omit<Note, 'id' | 'createdAt'>) => Promise<boolean>;
}

const NoteForm = ({ onSubmit }: NoteFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  // 添加提交动画效果
  const submitAnim = useSpring({
    transform: isSubmitting ? 'scale(0.98)' : 'scale(1)',
    config: { tension: 300, friction: 10 }
  });

  // 表单验证
  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = '标题不能为空';
    } else if (title.length > 50) {
      newErrors.title = '标题最多50个字符';
    }
    
    if (!content.trim()) {
      newErrors.content = '内容不能为空';
    } else if (content.length > 50) {
      newErrors.content = '内容最多50个字符';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await onSubmit({ title, content });
      
      if (success) {
        // 重置表单
        setTitle('');
        setContent('');
        setErrors({});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700">
          标题 <span className="text-xs text-gray-500">(最多50字)</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={isSubmitting}
          placeholder="请输入标题"
          maxLength={50}
          aria-label="笔记标题"
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        <div className="mt-1 text-xs text-right text-gray-500">{title.length}/50</div>
      </div>
      
      <div>
        <label htmlFor="content" className="block mb-1 text-sm font-medium text-gray-700">
          内容 <span className="text-xs text-gray-500">(最多50字)</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          rows={3}
          disabled={isSubmitting}
          placeholder="请输入笔记内容"
          maxLength={50}
          aria-label="笔记内容"
        />
        {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
        <div className="mt-1 text-xs text-right text-gray-500">{content.length}/50</div>
      </div>
      
      <animated.div style={submitAnim}>
        <button
          type="submit"
          className="w-full px-4 py-2 font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isSubmitting}
          aria-label="提交笔记"
        >
          {isSubmitting ? '提交中...' : '添加笔记'}
        </button>
      </animated.div>
    </form>
  );
};

export default NoteForm; 