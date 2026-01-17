import { create } from 'zustand';

export type ToolType = 
  | 'idle'
  | 'merge' 
  | 'split' 
  | 'compress' 
  | 'rotate' 
  | 'pdf2img' 
  | 'img2pdf' 
  | 'organize' 
  | 'watermark' 
  | 'encrypt' 
  | 'decrypt' 
  | 'html2pdf'
  | 'deletePages';

interface AppState {
  currentTool: ToolType;
  files: File[];
  isProcessing: boolean;
  progress: number;
  setCurrentTool: (tool: ToolType) => void;
  setFiles: (files: File[]) => void;
  addFiles: (files: File[]) => void;
  clearFiles: () => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setProgress: (progress: number) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentTool: 'idle',
  files: [],
  isProcessing: false,
  progress: 0,
  setCurrentTool: (tool) => set({ currentTool: tool }),
  setFiles: (files) => set({ files }),
  addFiles: (newFiles) => set((state) => ({ files: [...state.files, ...newFiles] })),
  clearFiles: () => set({ files: [] }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setProgress: (progress) => set({ progress }),
  reset: () => set({ currentTool: 'idle', files: [], isProcessing: false, progress: 0 }),
}));
