import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { GlassCard } from "./GlassCard";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  sparklineData?: any[];
  sparklineColor?: string;
  icon?: React.ReactNode;
}

export const MetricCard = React.memo<MetricCardProps>(({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  sparklineData,
  sparklineColor = "#3b82f6",
  icon
}) => {
  const renderTrend = () => {
    if (!trend) return null;
    
    let TrendIcon = Minus;
    let colorClass = "text-slate-400";
    
    if (trend === "up") {
      TrendIcon = TrendingUp;
      colorClass = "text-emerald-400";
    } else if (trend === "down") {
      TrendIcon = TrendingDown;
      colorClass = "text-rose-400";
    }

    return (
      <span className={`text-[10px] font-bold flex items-center gap-1 font-mono ${colorClass}`}>
        {trend !== "neutral" && <TrendIcon className="w-3 h-3" />} {trendValue}
      </span>
    );
  };

  // Convert hex color to rgba for the fill gradient area
  const getRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <GlassCard hoverEffect className="flex flex-col justify-between gap-4 h-full">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {icon && <div className="text-slate-400">{icon}</div>}
          <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest font-mono">{title}</span>
        </div>
        {renderTrend()}
      </div>
      
      <div>
        <strong className="text-2xl sm:text-3xl font-black text-white font-mono leading-none tracking-tight">{value}</strong>
        {subtitle && <p className="text-[10.5px] text-slate-400 font-semibold mt-1">{subtitle}</p>}
      </div>

      {sparklineData && sparklineData.length > 0 && (
        <div className="h-8 w-full mt-2 opacity-70">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <Area 
                type="monotone" 
                dataKey="v" 
                stroke={sparklineColor} 
                fill={getRgba(sparklineColor, 0.15)} 
                strokeWidth={2} 
                dot={false} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
});
