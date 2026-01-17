import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Cpu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentTool, reset } = useAppStore();

  return (
    <div className="min-h-screen relative text-foreground selection:bg-cyber-cyan/30">
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Header */}
      <header className="relative z-50 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={reset}
        >
          <div className="p-2 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/20 group-hover:border-cyber-cyan/50 transition-colors">
            <Cpu className="w-6 h-6 text-cyber-cyan" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AETHERIA <span className="text-cyber-cyan">PDF</span></h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Premium Client-Side Intelligence</p>
          </div>
        </div>

        <AnimatePresence>
          {currentTool !== 'idle' && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:bg-white/5 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Tool
            </motion.button>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pb-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 text-center space-y-6">
        <p className="text-sm text-muted-foreground/50 font-serif italic">
          100% Private. All processing happens in your browser.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[11px] uppercase tracking-[0.3em] font-serif text-muted-foreground/40">
          <a 
            href="https://x.com/iamsaranhere" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-cyber-cyan transition-colors"
          >
            Made with 💝 by <span className="italic">sarankumar</span>
          </a>
          <span className="w-1 h-1 rounded-full bg-white/10 hidden md:block" />
          <span className="hover:text-cyber-cyan transition-colors cursor-default italic">
            Proudly Open Source
          </span>
          <span className="w-1 h-1 rounded-full bg-white/10 hidden md:block" />
          <a 
            href="https://buymeacoffee.com/swsarancodes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:border-cyber-cyan/30 hover:text-cyber-cyan hover:bg-white/10 transition-all group"
          >
            <span className="text-sm group-hover:scale-110 transition-transform">☕</span>
            <span className="font-serif tracking-[0.2em]">BUY ME A COFFEE</span>
          </a>
        </div>
      </footer>
    </div>
  );
};
