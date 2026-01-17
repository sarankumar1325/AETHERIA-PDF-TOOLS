import React from 'react';
import { ToolContainer } from './ToolContainer';
import { useAppStore } from '@/store/useAppStore';
import { imagesToPDF, downloadBlob } from '@/lib/pdf/pdfManager';

export const ImagesToPDFTool: React.FC = () => {
  const { files, setIsProcessing, setProgress } = useAppStore();

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const pdfData = await imagesToPDF(files, (p) => setProgress(p));
      downloadBlob(pdfData, `Aetheria_Vision_${Date.now()}.pdf`);
    } catch (error) {
      console.error("Conversion failed:", error);
      alert("Intelligence failure during image conversion.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <ToolContainer
      title="Vision Synthesis"
      description="Synthesize your visual assets into high-performance PDF documents. Optimized for JPEG, PNG, and WebP sources."
      actionLabel="Execute Synthesis"
      onAction={handleConvert}
      accept=".jpg,.jpeg,.png,.webp"
    >
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold">
          Queue: {files.length} Visual Asset{files.length !== 1 ? 's' : ''} Buffered
        </p>
      </div>
    </ToolContainer>
  );
};
