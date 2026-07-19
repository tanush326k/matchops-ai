import React from "react";
import { Cloud, Droplets, Wind, Thermometer, AlertTriangle, Sun, CloudRain, CloudLightning } from "lucide-react";

interface WeatherData {
  condition: string;
  temperature_f: number;
  humidity: number;
  wind_mph: number;
  rain_probability: number;
  visibility_miles: number;
  operational_impact: "Low" | "Moderate" | "High" | "Severe";
  alert?: string;
}

interface WeatherIntelligenceProps {
  data?: WeatherData;
}

const FALLBACK: WeatherData = {
  condition: "Partly Cloudy",
  temperature_f: 74,
  humidity: 62,
  wind_mph: 11,
  rain_probability: 18,
  visibility_miles: 9.5,
  operational_impact: "Low",
};

const conditionIcon = (cond: string) => {
  const c = cond.toLowerCase();
  if (c.includes("storm") || c.includes("thunder")) return <CloudLightning className="w-6 h-6 text-yellow-400" />;
  if (c.includes("rain") || c.includes("drizzle")) return <CloudRain className="w-6 h-6 text-blue-400" />;
  if (c.includes("cloud")) return <Cloud className="w-6 h-6 text-slate-400" />;
  return <Sun className="w-6 h-6 text-amber-400" />;
};

const impactColors = {
  Low: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  Moderate: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  High: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  Severe: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

export const WeatherIntelligence = React.memo<WeatherIntelligenceProps>(({ data }) => {
  const w = data || FALLBACK;
  const ic = impactColors[w.operational_impact];

  return (
    <div className="glass rounded-3xl border border-white/5 p-4 glow-card space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Cloud className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-white font-display">Weather Intelligence</h3>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">MetLife Stadium</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-lg border text-[9px] font-bold font-mono uppercase tracking-widest ${ic.bg} ${ic.border} ${ic.text}`}>
          {w.operational_impact} Impact
        </div>
      </div>

      {/* Main Weather Row */}
      <div className="flex items-center gap-4 p-3 bg-slate-950/60 rounded-2xl border border-white/5">
        {conditionIcon(w.condition)}
        <div className="flex-1">
          <div className="text-xl font-black text-white font-mono">{w.temperature_f}°F</div>
          <div className="text-[10px] text-slate-400 font-semibold">{w.condition}</div>
        </div>
        <div className="text-right space-y-1">
          <div className="text-[9px] text-slate-500 font-mono">Visibility</div>
          <div className="text-xs font-bold text-white font-mono">{w.visibility_miles} mi</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        {/* Rain Probability */}
        <div className="p-2 bg-slate-950/50 rounded-xl border border-white/5 space-y-1.5">
          <div className="flex items-center gap-1 text-blue-400">
            <Droplets className="w-3 h-3" />
            <span className="text-[8px] font-bold uppercase tracking-widest font-mono">Rain</span>
          </div>
          <div className="text-xs font-black text-white font-mono">{w.rain_probability}%</div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${w.rain_probability}%` }}
            />
          </div>
        </div>

        {/* Wind */}
        <div className="p-2 bg-slate-950/50 rounded-xl border border-white/5 space-y-1.5">
          <div className="flex items-center gap-1 text-slate-400">
            <Wind className="w-3.5 h-3.5" />
            <span className="text-[8px] font-bold uppercase tracking-widest font-mono">Wind</span>
          </div>
          <div className="text-xs font-black text-white font-mono">{w.wind_mph} mph</div>
        </div>

        {/* Humidity */}
        <div className="p-2 bg-slate-950/50 rounded-xl border border-white/5 space-y-1.5">
          <div className="flex items-center gap-1 text-slate-400">
            <Thermometer className="w-3 h-3" />
            <span className="text-[8px] font-bold uppercase tracking-widest font-mono">Humid</span>
          </div>
          <div className="text-xs font-black text-white font-mono">{w.humidity}%</div>
        </div>
      </div>

      {/* Alert Banner */}
      {w.alert && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[10px] text-amber-400 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 animate-pulse" />
          {w.alert}
        </div>
      )}
    </div>
  );
});
