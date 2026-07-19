import React from "react";

interface StatusBadgeProps {
  status: "Active" | "Resolved" | "Pending" | "High" | "Medium" | "Low" | "Critical";
}

export const StatusBadge = React.memo<StatusBadgeProps>(({ status }) => {
  const getStyle = () => {
    switch (status) {
      case "Active":
      case "Critical":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Resolved":
      case "Low":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "High":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Pending":
      case "Medium":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest font-mono inline-flex items-center justify-center whitespace-nowrap ${getStyle()}`}>
      {status}
    </span>
  );
});
