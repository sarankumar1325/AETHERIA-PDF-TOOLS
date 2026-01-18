import React from 'react';
import { ToolContainer } from './ToolContainer';
import { useAppStore } from '@/store/useAppStore';
import { splitPDF, downloadMultiple } from '@/lib/pdf/pdfManager';

export const SplitTool: React.FC = () => {
  const { files, setIsProcessing, setProgress } = useAppStore();

  const handleSplit = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Split the first file in the list
      const splitData = await splitPDF(files[0]!, (p) => setProgress(p));
      await downloadMultiple(splitData, `v0pdftools_Split_${Date.now()}`);
    } catch (error) {
      console.error("Split failed:", error);
      alert("Intelligence failure during split operation.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <ToolContainer
      title="Split Intelligence"
      description="Deconstruct a singular PDF entity into its constituent pages. Ideal for granular data extraction and reorganization."
      actionLabel="Execute Split"
      onAction={handleSplit}
      multiple={false} // Only split one file at a time
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
