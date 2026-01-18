import React, { useState } from 'react';
import { ToolContainer } from './ToolContainer';
import { useAppStore } from '@/store/useAppStore';
import { watermarkPDF, downloadBlob } from '@/lib/pdf/pdfManager';
import { Type } from 'lucide-react';

export const WatermarkTool: React.FC = () => {
  const { files, setIsProcessing, setProgress } = useAppStore();
  const [text, setText] = useState('CONFIDENTIAL');

  const handleWatermark = async () => {
    if (files.length === 0 || !text) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const watermarkedData = await watermarkPDF(files[0]!, text, (p) => setProgress(p));
      downloadBlob(watermarkedData, `v0pdftools_Marked_${Date.now()}.pdf`);
    } catch (error) {
      console.error("Watermark failed:", error);
      alert("Intelligence failure during watermark operation.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <ToolContainer
      title="Identity Layering"
      description="Imprint your documents with authoritative text watermarks. Custom position and opacity optimized for clarity and security."
      actionLabel="Execute Watermark"
      onAction={handleWatermark}
      multiple={false}
    >
      <div className="max-w-md mx-auto w-full space-y-4">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 border border-white/20 group-focus-within:border-luxe-brown/50 transition-colors">
            <Type className="w-4 h-4 text-luxe-brown" />
          </div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ENTER WATERMARK TEXT"
            className="w-full bg-white/20 border border-luxe-brown/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold tracking-widest focus:border-luxe-brown/50 focus:bg-white/30 transition-all outline-none text-luxe-brown placeholder:text-luxe-brown/40"
          />
        </div>
      </div>
    </ToolContainer>
  );
};
