import React from "react";
import { Sparkles, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface InsightCardProps {
  title: string;
  description: string;
  priority?: "Low" | "Medium" | "High" | "Critical";
  confidence?: number;
  reasoning?: string;
  metricLabel?: string;
  metricValue?: string;
  timestamp?: string;
  onActionClick?: () => void;
  actionLabel?: string;
}

export const InsightCard = React.memo<InsightCardProps>(({
  title,
  description,
  priority = "Medium",
  confidence,
  reasoning,
  metricLabel,
  metricValue,
  timestamp,
  onActionClick,
  actionLabel
}) => {
  const getPriorityColor = () => {
    switch (priority) {
      case "Critical": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "High": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Medium": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Low": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getPriorityIcon = () => {
    switch (priority) {
      case "Critical": return <AlertTriangle className="w-3 h-3" />;
      case "High": return <AlertTriangle className="w-3 h-3" />;
      case "Medium": return <Info className="w-3 h-3" />;
      case "Low": return <CheckCircle className="w-3 h-3" />;
      default: return <Info className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-indigo-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 font-mono">Gemini Insight</span>
        </div>
        
        {timestamp && (
          <span className="text-[9px] text-slate-500 font-mono">{timestamp}</span>
        )}
      </div>

      <h4 className="text-sm font-bold text-white font-display mb-1.5 relative z-10">{title}</h4>
      <p className="text-xs text-slate-300 leading-relaxed mb-4 relative z-10 font-medium">
        {description}
      </p>

      {reasoning && (
        <div className="mb-4 bg-slate-950/50 rounded-xl p-3 border border-white/5 relative z-10">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-1">Reasoning</span>
          <p className="text-[11px] text-slate-400 font-medium">{reasoning}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center justify-between mt-auto relative z-10 border-t border-white/5 pt-4">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold font-mono border ${getPriorityColor()}`}>
            {getPriorityIcon()}
            {priority} Priority
          </div>
          
          {confidence && (
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-300">
              Confidence: <span className={confidence > 85 ? "text-emerald-400" : "text-amber-400"}>{confidence}%</span>
            </div>
          )}
        </div>

        {metricValue && metricLabel && (
          <div className="text-right">
            <div className="text-[9px] text-slate-500 uppercase font-bold font-mono">{metricLabel}</div>
            <div className="text-xs font-bold text-white">{metricValue}</div>
          </div>
        )}

        {actionLabel && onActionClick && (
          <button 
            onClick={onActionClick}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-[11px] font-bold rounded-xl transition-colors shadow-md shadow-indigo-500/20 ml-auto cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
});
