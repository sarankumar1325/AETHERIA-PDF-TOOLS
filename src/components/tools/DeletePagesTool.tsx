import React, { useState } from 'react';
import { ToolContainer } from './ToolContainer';
import { useAppStore } from '@/store/useAppStore';
import { removePagesFromPDF, downloadBlob } from '@/lib/pdf/pdfManager';
import { Trash2 } from 'lucide-react';

export const DeletePagesTool: React.FC = () => {
  const { files, setIsProcessing, setProgress } = useAppStore();
  const [pageRange, setPageRange] = useState('');

  const parsePageRange = (rangeStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(',').map(p => p.trim());

    parts.forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (start && end) {
          for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
            if (i > 0 && i <= maxPages) pages.add(i - 1); // 0-indexed
          }
        }
      } else {
        const page = Number(part);
        if (page && page > 0 && page <= maxPages) {
          pages.add(page - 1); // 0-indexed
        }
      }
    });

    return Array.from(pages);
  };

  const handleDelete = async () => {
    if (files.length === 0 || !pageRange) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // We need to know the total page count to validate the range
      // For simplicity, we'll let the manager handle bounds, but we parse here
      // To be safe, we'd ideally load the PDF first to get page count, but removePage handles bounds
      const indicesToDelete = parsePageRange(pageRange, 10000); // 10k as a safe upper bound for parsing
      
      const modifiedData = await removePagesFromPDF(files[0]!, indicesToDelete, (p) => setProgress(p));
      downloadBlob(modifiedData, `v0pdftools_Refined_${Date.now()}.pdf`);
    } catch (error) {
      console.error("Deletion failed:", error);
      alert("Intelligence failure during page deletion. Please check your page range syntax.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <ToolContainer
      title="Selective Deletion"
      description="Prune unnecessary pages from your document with surgical precision. Enter individual pages or ranges to be permanently removed."
      actionLabel="Execute Deletion"
      onAction={handleDelete}
      multiple={false}
    >
      <div className="max-w-md mx-auto w-full space-y-4">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 border border-white/20 group-focus-within:border-luxe-brown/50 transition-colors">
            <Trash2 className="w-4 h-4 text-luxe-brown" />
          </div>
          <input
            type="text"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            placeholder="PAGES TO DELETE (e.g. 1, 3, 5-8)"
            className="w-full bg-white/20 border border-luxe-brown/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold tracking-widest focus:border-luxe-brown/50 focus:bg-white/30 transition-all outline-none text-luxe-brown placeholder:text-luxe-brown/40"
          />
        </div>
        
        <div className="p-4 rounded-xl bg-white/10 border border-white/20">
          <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-luxe-brown animate-pulse" />
            Syntax Protocol
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Use commas for individual pages (<span className="text-luxe-brown">1, 3, 5</span>) or hyphens for ranges (<span className="text-luxe-brown">10-15</span>). All indices are 1-based.
          </p>
        </div>
      </div>
    </ToolContainer>
  );
};
