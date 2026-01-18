import React, { useState } from 'react';
import { ToolContainer } from './ToolContainer';
import { useAppStore } from '@/store/useAppStore';
import { rotatePDF, downloadBlob } from '@/lib/pdf/pdfManager';
import { RotateCw } from 'lucide-react';

export const RotateTool: React.FC = () => {
  const { files, setIsProcessing, setProgress } = useAppStore();
  const [angle, setAngle] = useState(90);

  const handleRotate = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const rotatedData = await rotatePDF(files[0]!, angle, (p) => setProgress(p));
      downloadBlob(rotatedData, `v0pdftools_Rotated_${Date.now()}.pdf`);
    } catch (error) {
      console.error("Rotation failed:", error);
      alert("Intelligence failure during rotation operation.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <ToolContainer
      title="Precision Rotation"
      description="Adjust the spatial orientation of your PDF pages with mathematical accuracy. Perfect for correcting scanned documents."
      actionLabel="Execute Rotation"
      onAction={handleRotate}
      multiple={false}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-4">
          {[90, 180, 270].map((deg) => (
            <button
              key={deg}
              onClick={() => setAngle(deg)}
              className={`px-6 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 text-sm font-bold ${
                angle === deg 
                  ? "bg-luxe-brown/10 border-luxe-brown text-luxe-brown shadow-[0_0_15px_rgba(139,94,60,0.2)]" 
                  : "bg-white/20 border-white/10 text-muted-foreground hover:border-white/30"
              }`}
            >
              <RotateCw className={`w-4 h-4 ${angle === deg ? "animate-spin-slow" : ""}`} />
              {deg}°
            </button>
          ))}
        </div>
        
        <div className="text-center">
          {files.length > 0 ? (
            <p className="text-[10px] uppercase tracking-[0.3em] text-luxe-brown font-bold">
              Target: {files[0]?.name}
            </p>
          ) : (
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold">
              Awaiting Target Document
            </p>
          )}
        </div>
      </div>
    </ToolContainer>
  );
};
