import React from 'react';
import { ToolContainer } from './ToolContainer';
import { useAppStore } from '@/store/useAppStore';
import { mergePDFs, downloadBlob } from '@/lib/pdf/pdfManager';

export const MergeTool: React.FC = () => {
  const { files, setIsProcessing, setProgress } = useAppStore();

  const handleMerge = async () => {
    if (files.length < 1) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const mergedData = await mergePDFs(files, (p) => setProgress(p));
      downloadBlob(mergedData, `v0pdftools_Merged_${Date.now()}.pdf`);
    } catch (error) {
      console.error("Merge failed:", error);
      alert("Intelligence failure during merge operation. Please verify file integrity.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <ToolContainer
      title="Merge Intelligence"
      description="Seamlessly fuse multiple PDF streams into a single, cohesive document. Optimized for high-throughput client-side processing."
      actionLabel="Execute Merge"
      onAction={handleMerge}
    >
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold">
          Queue: {files.length} Document{files.length !== 1 ? 's' : ''} Ready
        </p>
      </div>
    </ToolContainer>
  );
};
