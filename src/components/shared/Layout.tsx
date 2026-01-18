import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Cpu } from 'lucide-react';
import { Magnetic } from './Magnetic';
import gsap from 'gsap';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentTool, reset } = useAppStore();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initial reveal animation
    const tl = gsap.timeline();
    tl.fromTo(headerRef.current, 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, ease: "expo.out" }
    );
  }, []);

  return (
    <div className="min-h-screen relative text-foreground selection:bg-luxe-brown/20">
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-luxe-gold/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-luxe-brown/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Header */}
      <header ref={headerRef} className="relative z-50 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto opacity-0">
        <Magnetic>
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={reset}
          >
            <div className="p-2 rounded-xl bg-luxe-sandal/5 border border-luxe-sandal/20 group-hover:border-luxe-sandal/50 transition-colors">
              <Cpu className="w-6 h-6 text-luxe-sandal" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter text-luxe-brown font-display">v0pdftools</h1>
            </div>
          </div>
        </Magnetic>

        <AnimatePresence>
          {currentTool !== 'idle' && (
            <Magnetic>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:bg-white/5 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4 text-luxe-brown" />
                <span className="text-luxe-brown font-display uppercase tracking-widest text-[10px]">Exit Tool</span>
              </motion.button>
            </Magnetic>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pb-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 text-center space-y-6">
        <p className="text-lg text-luxe-brown font-display">
          100% Private. All processing happens in your browser.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm font-display text-luxe-brown/80">
          <a 
            href="https://x.com/iamsaranhere" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-luxe-brown transition-colors"
          >
            Made with ❤️ by sarankumar
          </a>
          <span className="w-1 h-1 rounded-full bg-luxe-brown/40 hidden md:block" />
          <span className="hover:text-luxe-brown transition-colors cursor-default">
            Proudly Open Source
          </span>
          <span className="w-1 h-1 rounded-full bg-luxe-brown/40 hidden md:block" />
          <a 
            href="https://buymeacoffee.com/swsarancodes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/30 border border-luxe-brown/20 hover:border-luxe-brown/50 hover:text-luxe-brown hover:bg-white/50 transition-all group"
          >
            <span className="text-sm group-hover:scale-110 transition-transform">☕</span>
            <span className="font-display">BUY ME A COFFEE</span>
          </a>
        </div>
      </footer>
    </div>
  );
};
