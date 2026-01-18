import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Combine, 
  Scissors, 
  Zap, 
  RotateCcw, 
  Image as ImageIcon, 
  FileImage, 
  LayoutTemplate, 
  Type, 
  Lock, 
  Unlock, 
  Code,
  Trash2
} from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { useAppStore, ToolType } from '@/store/useAppStore';
import gsap from 'gsap';

interface Tool {
  id: ToolType;
  title: string;
  description: string;
  icon: React.ElementType;
  category: 'Organize' | 'Optimize' | 'Edit' | 'Convert' | 'Security';
}

const tools: Tool[] = [
  { id: 'merge', title: 'Merge PDF', description: 'Combine multiple files into one seamless document', icon: Combine, category: 'Organize' },
  { id: 'split', title: 'Split PDF', description: 'Extract specific pages or divide document into parts', icon: Scissors, category: 'Organize' },
  { id: 'compress', title: 'Compress', description: 'Advanced local reduction of file size with no quality loss', icon: Zap, category: 'Optimize' },
  { id: 'rotate', title: 'Rotate PDF', description: 'Perfectly align your pages with precision rotation', icon: RotateCcw, category: 'Edit' },
  { id: 'pdf2img', title: 'PDF to Images', description: 'Convert document pages to high-fidelity PNG or JPG', icon: FileImage, category: 'Convert' },
  { id: 'img2pdf', title: 'Images to PDF', description: 'Transform your visual assets into a professional PDF', icon: ImageIcon, category: 'Convert' },
  { id: 'organize', title: 'Organize', description: 'Drag, drop, and reorder pages with visual previews', icon: LayoutTemplate, category: 'Organize' },
  { id: 'watermark', title: 'Watermark', description: 'Apply subtle or bold text watermarks for security', icon: Type, category: 'Edit' },
  { id: 'encrypt', title: 'Encrypt', description: 'State-of-the-art AES-256 local password protection', icon: Lock, category: 'Security' },
  { id: 'decrypt', title: 'Decrypt', description: 'Remove password constraints from your own files', icon: Unlock, category: 'Security' },
  { id: 'html2pdf', title: 'HTML to PDF', description: 'Render HTML snippets directly to PDF locally', icon: Code, category: 'Convert' },
  { id: 'deletePages', title: 'Delete Pages', description: 'Remove specific pages or ranges with surgical precision', icon: Trash2, category: 'Organize' },
];

export const ToolGrid: React.FC = () => {
  const { setCurrentTool } = useAppStore();
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.tool-card-anim');
    
    gsap.fromTo(titleRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    if (cards) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 40, scale: 0.95 }, 
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8, 
          stagger: 0.05, 
          ease: "back.out(1.2)",
          delay: 0.2
        }
      );
    }
  }, []);

  return (
    <div className="mt-12">
      <div ref={titleRef} className="mb-12 text-center opacity-0">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 cyber-gradient-text tracking-tighter font-display">
          v0pdftools
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed font-display">
          Experience the pinnacle of document management. Secure, elegant, and entirely local.
        </p>
      </div>

      <div 
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {tools.map((tool) => (
          <div key={tool.id} className="tool-card-anim opacity-0">
            <GlassCard 
              className="h-full group"
              onClick={() => setCurrentTool(tool.id)}
            >
              <div className="flex flex-col h-full">
                <div className="mb-6 flex justify-between items-start">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-luxe-brown/30 transition-colors">
                    <tool.icon className="w-6 h-6 text-luxe-brown" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-display px-2 py-1 rounded bg-white/5">
                    {tool.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-luxe-brown transition-colors uppercase tracking-tight">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-display">
                  {tool.description}
                </p>
                
                <div className="mt-auto pt-6 flex items-center text-[10px] font-bold text-luxe-brown opacity-0 group-hover:opacity-100 transition-opacity tracking-[0.2em] font-display">
                  INITIATE MODULE 
                  <motion.span 
                    animate={{ x: [0, 5, 0] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="ml-2"
                  >
                    →
                  </motion.span>
                </div>
              </div>
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
};
