import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ 
  accept = ".pdf", 
  multiple = true 
}) => {
  const { files, addFiles, setFiles, clearFiles } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      return accept.includes(ext);
    });

    if (validFiles.length > 0) {
      if (multiple) {
        addFiles(validFiles);
      } else {
        setFiles([validFiles[0]]);
      }
    }
  }, [accept, multiple, addFiles, setFiles]);

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div className="space-y-6">
      <motion.div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        animate={{
          scale: isDragging ? 0.98 : 1,
          borderColor: isDragging ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255, 255, 255, 0.08)'
        }}
        className={cn(
          "relative group border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 overflow-hidden",
          isDragging ? "bg-cyber-cyan/5" : "bg-white/2"
        )}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          multiple={multiple}
          accept={accept}
          onChange={(e) => {
            if (e.target.files) {
              const selectedFiles = Array.from(e.target.files);
              if (multiple) {
                addFiles(selectedFiles);
              } else {
                setFiles([selectedFiles[0]]);
              }
            }
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className={cn(
            "p-5 rounded-2xl bg-white/5 border border-white/10 mb-6 transition-all duration-500",
            isDragging ? "scale-110 rotate-5 border-cyber-cyan/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]" : ""
          )}>
            <Upload className={cn("w-10 h-10 transition-colors", isDragging ? "text-cyber-cyan" : "text-muted-foreground")} />
          </div>
          
          <h3 className="text-2xl font-bold mb-2">
            {isDragging ? "Release to Initiate" : "Drop Your Documents"}
          </h3>
          <p className="text-muted-foreground text-sm font-light max-w-sm mx-auto leading-relaxed">
            Select files locally. Your data never leaves your device, guaranteed by architectural isolation.
          </p>
          
          <div className="mt-8 px-6 py-2 rounded-full glass-panel text-xs font-bold tracking-widest text-cyber-cyan border-cyber-cyan/20 group-hover:border-cyber-cyan/40 transition-colors">
            BROWSE FILES
          </div>
        </div>

        {/* Ambient background effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)]" />
        </div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {files.map((file, idx) => (
              <motion.div
                key={`${file.name}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel p-4 rounded-xl flex items-center gap-3 group relative overflow-hidden"
              >
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyber-cyan/30 transition-colors">
                  <FileText className="w-5 h-5 text-cyber-cyan" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {files.length > 0 && (
        <div className="flex justify-end">
          <button 
            onClick={clearFiles}
            className="text-xs text-muted-foreground hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        </div>
      )}
    </div>
  );
};
