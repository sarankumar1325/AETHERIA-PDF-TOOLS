import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  onClick, 
  hoverable = true 
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -5, scale: 1.02 } : {}}
      whileTap={hoverable ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        "glass-card p-6 rounded-2xl cursor-pointer group",
        className
      )}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
      
      {/* Decorative inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
    </motion.div>
  );
};
