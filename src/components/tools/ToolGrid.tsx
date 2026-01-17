import React from 'react';
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="mt-12">
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 cyber-gradient-text tracking-tight">
          Symphony of PDF Tools
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
          Experience the pinnacle of document management. Secure, elegant, and entirely local.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {tools.map((tool) => (
          <motion.div key={tool.id} variants={item}>
            <GlassCard 
              className="h-full group"
              onClick={() => setCurrentTool(tool.id)}
            >
              <div className="flex flex-col h-full">
                <div className="mb-6 flex justify-between items-start">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-cyber-cyan/30 transition-colors">
                    <tool.icon className="w-6 h-6 text-cyber-cyan" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold px-2 py-1 rounded bg-white/5">
                    {tool.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-cyber-cyan transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
                
                <div className="mt-auto pt-6 flex items-center text-xs font-bold text-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                  OPEN TOOL 
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
