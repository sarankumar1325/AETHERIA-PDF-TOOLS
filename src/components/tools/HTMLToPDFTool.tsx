import React, { useState } from 'react';
import { ToolContainer } from './ToolContainer';
import { useAppStore } from '@/store/useAppStore';
import { htmlToPDF, downloadBlob } from '@/lib/pdf/pdfManager';

export const HTMLToPDFTool: React.FC = () => {
  const { setIsProcessing, setProgress } = useAppStore();
  const [html, setHtml] = useState('<h1>Hello v0pdftools</h1>\n<p>Enter your HTML code here to render it locally to PDF.</p>\n<div style="background: #8B5E3C; color: white; padding: 20px; border-radius: 10px;">\n  Purely client-side intelligence.\n</div>');

  const handleConvert = async () => {
    if (!html) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const pdfData = await htmlToPDF(html, (p) => setProgress(p));
      downloadBlob(pdfData, `v0pdftools_Render_${Date.now()}.pdf`);
    } catch (error) {
      console.error("HTML conversion failed:", error);
      alert("Intelligence failure during HTML rendering.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <ToolContainer
      title="Neural HTML Renderer"
      description="Transform raw markup into professional PDF documents. All rendering occurs in an isolated client-side environment."
      actionLabel="Execute Render"
      onAction={handleConvert}
      allowUpload={false}
    >
      <div className="space-y-4">
        <div className="glass-panel rounded-2xl p-4 overflow-hidden border-luxe-brown/10 bg-white/20">
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full h-64 bg-transparent font-mono text-sm border-none focus:ring-0 outline-none resize-none text-luxe-brown"
            spellCheck={false}
          />
        </div>
        <div className="flex justify-between items-center px-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            SOURCE CODE BUFFER
          </p>
          <button 
            onClick={() => setHtml('')}
            className="text-[10px] text-muted-foreground hover:text-red-400 uppercase tracking-widest font-bold transition-colors"
          >
            Clear Buffer
          </button>
        </div>
      </div>
    </ToolContainer>
  );
};
