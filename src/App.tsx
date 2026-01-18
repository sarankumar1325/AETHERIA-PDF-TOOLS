import React from 'react';
import { Layout } from './components/shared/Layout';
import { ToolGrid } from './components/tools/ToolGrid';
import { MergeTool } from './components/tools/MergeTool';
import { SplitTool } from './components/tools/SplitTool';
import { RotateTool } from './components/tools/RotateTool';
import { EncryptTool } from './components/tools/EncryptTool';
import { ImagesToPDFTool } from './components/tools/ImagesToPDFTool';
import { HTMLToPDFTool } from './components/tools/HTMLToPDFTool';
import { WatermarkTool } from './components/tools/WatermarkTool';
import { PDFToImagesTool } from './components/tools/PDFToImagesTool';
import { DeletePagesTool } from './components/tools/DeletePagesTool';
import { useAppStore } from './store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';

import "./index.css";

export function App() {
  const { currentTool } = useAppStore();

  const renderTool = () => {
    switch (currentTool) {
      case 'merge': return <MergeTool />;
      case 'split': return <SplitTool />;
      case 'rotate': return <RotateTool />;
      case 'encrypt': return <EncryptTool />;
      case 'img2pdf': return <ImagesToPDFTool />;
      case 'html2pdf': return <HTMLToPDFTool />;
      case 'watermark': return <WatermarkTool />;
      case 'pdf2img': return <PDFToImagesTool />;
      case 'deletePages': return <DeletePagesTool />;
      case 'idle': return <ToolGrid />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h2 className="text-2xl font-display mb-4 text-cyber-cyan">Tool Under Construction</h2>
            <p className="text-muted-foreground">The neural pathways for this module are currently being optimized.</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTool}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderTool()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
