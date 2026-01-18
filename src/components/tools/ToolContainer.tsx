import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { FileDropzone } from '../shared/FileDropzone';
import { Cpu, Loader2 } from 'lucide-react';
import gsap from 'gsap';

interface ToolContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onAction: () => void;
  actionLabel: string;
  allowUpload?: boolean;
  accept?: string;
  multiple?: boolean;
}

export const ToolContainer: React.FC<ToolContainerProps> = ({
  title,
  description,
  children,
  onAction,
  actionLabel,
  allowUpload = true,
  accept = ".pdf",
  multiple = true
}) => {
  const { isProcessing, progress, files } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, scale: 0.98, y: 10 }, 
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="max-w-4xl mx-auto mt-8 opacity-0"
    >
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold mb-3 cyber-gradient-text">{title}</h2>
        <p className="text-muted-foreground text-sm font-light leading-relaxed">{description}</p>
      </div>

      <div className="space-y-8">
        {allowUpload && (
          <div className="glass-panel rounded-3xl p-2 bg-white/2">
            <FileDropzone accept={accept} multiple={multiple} />
          </div>
        )}

        {children}

        <div className="flex flex-col items-center gap-6 mt-12">
          {isProcessing && (
            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between items-end text-xs font-bold uppercase tracking-widest text-luxe-brown">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Processing Intelligence
                </div>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden border border-luxe-brown/10">
                <motion.div 
                  className="h-full bg-luxe-brown shadow-[0_0_10px_rgba(139,94,60,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={onAction}
            disabled={isProcessing || (allowUpload && files.length === 0)}
            className="relative group px-12 py-4 rounded-2xl bg-luxe-brown text-luxe-sandal font-bold text-sm tracking-widest overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(139,94,60,0.4)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-display"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  PROCESSING...
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  {actionLabel.toUpperCase()}
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
        </div>
      </div>
    </div>
  );
};
