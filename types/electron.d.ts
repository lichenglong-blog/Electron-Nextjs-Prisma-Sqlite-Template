// 定义 Electron API 暴露给浏览器的接口类型

interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt?: Date;
}

interface ElectronAPI {
  createNote: (note: Omit<Note, 'id' | 'createdAt'>) => Promise<{ success: boolean; note?: Note; error?: string }>;
  getNotes: () => Promise<{ success: boolean; notes?: Note[]; error?: string }>;
  deleteNote: (id: number) => Promise<{ success: boolean; error?: string }>;
}

interface Window {
  electronAPI: ElectronAPI;
} 