import React from 'react';
import { ToolContainer } from './ToolContainer';
import { useAppStore } from '@/store/useAppStore';
import { pdfToImages, downloadImages } from '@/lib/pdf/pdfManager';

export const PDFToImagesTool: React.FC = () => {
  const { files, setIsProcessing, setProgress } = useAppStore();

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const images = await pdfToImages(files[0]!, (p) => setProgress(p));
      await downloadImages(images, `v0pdftools_Pixels_${Date.now()}`);
    } catch (error) {
      console.error("PDF to Image conversion failed:", error);
      alert("Intelligence failure during pixel extraction. Please ensure the document is not encrypted.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <ToolContainer
      title="Pixel Extraction"
      description="Deconstruct your PDF document into a sequence of high-fidelity PNG images. Optimized for preservation of detail and color accuracy."
      actionLabel="Execute Extraction"
      onAction={handleConvert}
      multiple={false}
    >
      <div className="text-center">
        {files.length > 0 ? (
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyber-cyan font-bold">
            Target: {files[0]?.name}
          </p>
        ) : (
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold">
            Awaiting Target Document
          </p>
        )}
      </div>
    </ToolContainer>
  );
};
