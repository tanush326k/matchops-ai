import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  accentColor?: string;
}

export const GlassCard = React.memo<GlassCardProps>(({ 
  children, 
  className = "", 
  hoverEffect = false,
  accentColor
}) => {
  const accentStyle = accentColor ? { borderLeftColor: accentColor, borderLeftWidth: '4px' } : {};

  return (
    <div 
      className={`glass p-5 rounded-2xl border border-white/5 glow-card relative overflow-hidden transition-all duration-300 ${hoverEffect ? 'hover:border-white/10 hover:bg-slate-900/40 hover:-translate-y-0.5' : ''} ${className}`}
      style={accentStyle}
    >
      {children}
    </div>
  );
});
