import React, { useState } from 'react';
import { ToolContainer } from './ToolContainer';
import { useAppStore } from '@/store/useAppStore';
import { encryptPDF, downloadBlob } from '@/lib/pdf/pdfManager';
import { Lock, Eye, EyeOff } from 'lucide-react';

export const EncryptTool: React.FC = () => {
  const { files, setIsProcessing, setProgress } = useAppStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEncrypt = async () => {
    if (files.length === 0 || !password) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const encryptedData = await encryptPDF(files[0]!, password, (p) => setProgress(p));
      downloadBlob(encryptedData, `v0pdftools_Secure_${Date.now()}.pdf`);
    } catch (error) {
      console.error("Encryption failed:", error);
      alert("Intelligence failure during encryption operation.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <ToolContainer
      title="AES-256 Vault"
      description="Apply high-grade local encryption to your sensitive documents. Passwords are processed in memory and never persisted or transmitted."
      actionLabel="Execute Encryption"
      onAction={handleEncrypt}
      multiple={false}
    >
      <div className="max-w-md mx-auto w-full space-y-6">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 border border-white/20 group-focus-within:border-luxe-brown/50 transition-colors">
            <Lock className="w-4 h-4 text-luxe-brown" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ENTER SECURE PASSCODE"
            className="w-full bg-white/20 border border-luxe-brown/10 rounded-2xl py-4 pl-14 pr-12 text-sm font-mono tracking-widest focus:border-luxe-brown/50 focus:bg-white/30 transition-all outline-none text-luxe-brown placeholder:text-luxe-brown/40"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-luxe-brown transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="p-4 rounded-xl bg-luxe-brown/5 border border-luxe-brown/10">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <span className="text-luxe-brown font-bold">PROTOCOL:</span> This operation utilizes client-side cryptographic primitives. Ensure you record your passcode, as v0pdftools PDF cannot recover encrypted streams.
          </p>
        </div>
      </div>
    </ToolContainer>
  );
};
