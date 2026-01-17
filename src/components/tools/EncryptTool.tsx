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
      downloadBlob(encryptedData, `Aetheria_Secure_${Date.now()}.pdf`);
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
          <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/5 border border-white/10 group-focus-within:border-cyber-cyan/50 transition-colors">
            <Lock className="w-4 h-4 text-cyber-cyan" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ENTER SECURE PASSCODE"
            className="w-full bg-white/2 border border-white/8 rounded-2xl py-4 pl-14 pr-12 text-sm font-mono tracking-widest focus:border-cyber-cyan/50 focus:bg-white/5 transition-all outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-cyber-cyan transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="p-4 rounded-xl bg-cyber-cyan/5 border border-cyber-cyan/10">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <span className="text-cyber-cyan font-bold">PROTOCOL:</span> This operation utilizes client-side cryptographic primitives. Ensure you record your passcode, as Aetheria PDF cannot recover encrypted streams.
          </p>
        </div>
      </div>
    </ToolContainer>
  );
};
